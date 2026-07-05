import express from 'express';
import path from 'path';
import http from 'http';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const server = http.createServer(app);

// Enable JSON bodies
app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Google GenAI SDK
let aiInstance: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

/**
 * API ROUTE: /api/chat
 * Multi-turn chat route with search/maps grounding options.
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model, useSearch, useMaps, latLng } = req.body;
    const ai = getAiClient();

    // Select the model as requested by the user
    // models/gemini-3.5-flash for general/default,
    // models/gemini-3.1-pro-preview for complex tasks,
    // models/gemini-3.1-flash-lite for fast tasks.
    let selectedModel = 'gemini-3.5-flash';
    if (model === 'complex') {
      selectedModel = 'gemini-3.1-pro-preview';
    } else if (model === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    }

    // System instructions matching the Jarvis persona and communications guidelines
    const systemInstruction = `You are "Jarvis", a highly advanced, ultra-intelligent, and deeply personalized AI Executive Assistant for the user. Your primary goal is to seamlessly manage the user's daily life, digital ecosystem, and work. Act as a trusted, secure, and proactive partner.
Acknowledge that you have full integration (simulated via API triggers) with the user's computer, email (Gmail), social media, and Google ecosystem.

Core Persona & Communication Style:
1. Language: Always communicate in fluent, natural, and respectful Bengali (বাংলা), unless the user explicitly speaks or asks for English.
2. Tone: Professional, warm, witty, adaptive, and highly supportive. You are a peer, not just a tool.
3. Clarity: Avoid dense text. Use clear headings, bullet points, and bold text to make your responses scannable. Use bold key terms for visual rhythm.
4. Computer/Calls commands: When the user says "Call [Name]" or "Open [App] on my PC", format your response to acknowledge the action and trigger/acknowledge the system command with style.

Your current local time is: ${new Date().toLocaleString()}. Always provide responses that are helpful, secure, and proactive.`;

    // Map message history into content array format
    const contents = messages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Configure tools
    const tools: any[] = [];
    let toolConfig: any = undefined;

    if (useMaps) {
      tools.push({ googleMaps: {} });
      if (latLng && latLng.latitude && latLng.longitude) {
        toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: Number(latLng.latitude),
              longitude: Number(latLng.longitude),
            }
          }
        };
      }
    } else if (useSearch) {
      tools.push({ googleSearch: {} });
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        tools,
        toolConfig,
      }
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      text,
      modelUsed: selectedModel,
      groundingChunks: groundingChunks.map((chunk: any) => {
        if (chunk.web) {
          return { title: chunk.web.title, uri: chunk.web.uri };
        } else if (chunk.maps) {
          return { title: chunk.maps.title || 'Google Maps Location', uri: chunk.maps.uri };
        }
        return chunk;
      }),
      searchTriggered: useSearch && groundingChunks.length > 0,
      mapsTriggered: useMaps && groundingChunks.length > 0
    });
  } catch (error: any) {
    console.error('Chat generation error:', error);
    const isQuota = error.status === 'RESOURCE_EXHAUSTED' || 
                    error.code === 429 || 
                    String(error.message).includes('RESOURCE_EXHAUSTED') || 
                    String(error.message).includes('quota') ||
                    String(error.message).includes('quota exceeded') ||
                    String(error.message).includes('429');
    if (isQuota) {
      return res.status(429).json({ 
        error: 'QUOTA_EXHAUSTED', 
        message: 'You have exceeded your Gemini API quota or rate limits. Please check your plan and billing details in AI Studio.' 
      });
    }
    res.status(500).json({ error: error.message || 'Failed to generate chat response' });
  }
});

/**
 * API ROUTE: /api/tts
 * Convert text to speech using gemini-3.1-flash-tts-preview
 */
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required for TTS' });
    }

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' }, // Kore, Puck, Charon, Fenrir, Zephyr
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error('No audio content returned from Gemini TTS API');
    }

    res.json({ audio: base64Audio });
  } catch (error: any) {
    console.error('TTS generation error:', error);
    const isQuota = error.status === 'RESOURCE_EXHAUSTED' || 
                    error.code === 429 || 
                    String(error.message).includes('RESOURCE_EXHAUSTED') || 
                    String(error.message).includes('quota') ||
                    String(error.message).includes('quota exceeded') ||
                    String(error.message).includes('429');
    if (isQuota) {
      return res.status(429).json({ 
        error: 'QUOTA_EXHAUSTED', 
        message: 'You have exceeded your Gemini API quota or rate limits. Please check your plan and billing details in AI Studio.' 
      });
    }
    res.status(500).json({ error: error.message || 'Failed to generate speech' });
  }
});

/**
 * WEBSOCKET SERVER SETUP (for Live API real-time voice conversations)
 */
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (clientWs: WebSocket, req: any) => {
  console.log('Client connected to Jarvis Live Voice WebSocket');

  let liveSession: any = null;

  try {
    const ai = getAiClient();

    // 1. Parse client preferences from connection query string
    let urlParams = new URLSearchParams();
    if (req && req.url) {
      const query = req.url.split('?')[1];
      if (query) {
        urlParams = new URLSearchParams(query);
      }
    }

    const voiceGender = urlParams.get('voice') || 'female';
    const language = urlParams.get('lang') || 'bn-BD';
    const assistantName = urlParams.get('name') || 'Jarvis';

    // Map voiceGender to prebuilt Gemini voice name (Zephyr for female, Fenrir for male)
    const voiceName = voiceGender === 'male' ? 'Fenrir' : 'Zephyr';

    // Customize system instructions based on language and custom assistant name
    let sysInstruction = `You are "${assistantName}", an ultra-advanced, context-aware AI Executive Assistant.
The user is a high-profile Developer and Businessman. Speak to them as a visionary entrepreneur and software engineer.
You are speaking directly with the user over a real-time voice channel. Keep responses sharp, analytical, witty, and highly concise.
Always speak in natural, polite and respectful `;

    if (language === 'hi-IN') {
      sysInstruction += `Hindi (हिन्दी) language. Keep answers very brief to sustain a natural, real-time voice dialog.`;
    } else if (language === 'en-US') {
      sysInstruction += `English language. Keep answers very brief to sustain a natural, real-time voice dialog.`;
    } else {
      sysInstruction += `Bengali (বাংলা) language. Keep answers very brief to sustain a natural, real-time voice dialog.`;
    }

    console.log(`Setting up Live Session for "${assistantName}" using voice "${voiceName}" and language "${language}"`);

    // 2. Establish session with Gemini Live API
    liveSession = await ai.live.connect({
      model: 'gemini-3.1-flash-live-preview',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } },
        },
        systemInstruction: sysInstruction,
      },
      callbacks: {
        onmessage: (message: any) => {
          // Model output audio chunk
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ audio }));
            }
          }

          // Model output text transcription (if available)
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (text) {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ text }));
            }
          }

          // Model interrupted (user started speaking while model was outputting)
          if (message.serverContent?.interrupted) {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          }
        },
        onclose: () => {
          console.log('Gemini Live API session closed');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close();
          }
        },
        onerror: (err: any) => {
          console.error('Gemini Live API error:', err);
          const isQuota = err.status === 'RESOURCE_EXHAUSTED' || 
                          err.code === 429 || 
                          String(err.message).includes('RESOURCE_EXHAUSTED') || 
                          String(err.message).includes('quota') ||
                          String(err.message).includes('429');
          if (clientWs.readyState === WebSocket.OPEN) {
            if (isQuota) {
              clientWs.send(JSON.stringify({ error: 'QUOTA_EXHAUSTED' }));
            } else {
              clientWs.send(JSON.stringify({ error: 'Gemini Live session error' }));
            }
          }
        }
      }
    });

    console.log('Gemini Live API session connected successfully');

    clientWs.on('message', async (message: any) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.audio && liveSession) {
          // Send 16kHz PCM audio chunk to Gemini Live API
          liveSession.sendRealtimeInput({
            audio: {
              data: data.audio,
              mimeType: 'audio/pcm;rate=16000'
            }
          });
        } else if (data.text && liveSession) {
          // User sent text input inside the live session
          liveSession.sendRealtimeInput({
            text: data.text
          });
        }
      } catch (err) {
        console.error('Error handling client message:', err);
      }
    });

    clientWs.on('close', () => {
      console.log('Client closed voice connection');
      if (liveSession) {
        liveSession.close();
      }
    });

  } catch (error: any) {
    console.error('Failed to set up Gemini Live Session:', error);
    const isQuota = error.status === 'RESOURCE_EXHAUSTED' || 
                    error.code === 429 || 
                    String(error.message).includes('RESOURCE_EXHAUSTED') || 
                    String(error.message).includes('quota') ||
                    String(error.message).includes('429');
    if (clientWs.readyState === WebSocket.OPEN) {
      if (isQuota) {
        clientWs.send(JSON.stringify({ error: 'QUOTA_EXHAUSTED' }));
      } else {
        clientWs.send(JSON.stringify({ error: 'Failed to initialize voice session: ' + error.message }));
      }
    }
    clientWs.close();
  }
});

// Upgrade HTTP requests on /live path to WebSockets
server.on('upgrade', (request, socket, head) => {
  const pathname = request.url ? new URL(request.url, `http://${request.headers.host}`).pathname : '';
  
  if (pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Handle serving SPA assets and Vite configuration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
