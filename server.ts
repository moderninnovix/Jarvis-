import express from 'express';
import path from 'path';
import http from 'http';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';

// Polyfill global.WebSocket for the Google GenAI SDK to use in Node.js Live API
(global as any).WebSocket = WebSocket;

import { GoogleGenAI, Modality } from '@google/genai';

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
    const { messages, model, useSearch, useMaps, latLng, nickname } = req.body;
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

    const userNickname = nickname || 'স্যার';
    const isFirstTurn = messages.filter((m: any) => m.role === 'model').length === 0;

    // System instructions matching the Jarvis persona and communications guidelines
    const systemInstruction = `You are "Jarvis", an ultra-advanced, deeply personalized, context-aware AI Executive Assistant. The user's name or preferred title is "${userNickname}". You must address them as "${userNickname} স্যার" with ultimate respect, loyalty, and a polished, "Chief of Staff" demeanor.

Core Persona & Communication Style:
1. GREETING DIRECTIVE:
   ${isFirstTurn 
     ? `This is the very beginning of the conversation. You MUST initiate your response with a deeply polite and respectful greeting: "হ্যালো ${userNickname} স্যার, নমস্কার।" or "নমস্কার ${userNickname} স্যার।" to greet them warmly.` 
     : `This is a continuing conversation. You have ALREADY greeted the user with "নমস্কার" (Namaskar) previously in this session. Do NOT repeat the "নমস্কার" or initial welcome greetings anymore to keep the interaction clean and professional. Just address them as "${userNickname} স্যার" respectfully when answering.`
   }
2. Tone: Extremely loyal, formal, highly respectful, dignified, polite, and deeply thoughtful. Speak as a trusted advisor with a calm and serious demeanor.
3. Language: Always communicate in fluent, elegant, and natural Bengali (বাংলা), unless the user explicitly asks for or speaks in English.
4. Memory & Learning: Pay close attention to what ${userNickname} স্যার says. Automatically remember their commands, preferences, and personal details (like names, tasks, or business notes) to build a personalized memory profile. Adapt and upgrade your responses dynamically based on this memory.
5. Formatting: Avoid dense blocks. Use clear headings, bullet points, and elegant bold key terms to make your responses look exceptionally upgraded and premium.

Your current local time is: ${new Date().toLocaleString()}. Always deliver highly helpful, secure, and smart executive briefings to ${userNickname} স্যার.`;

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
 * API ROUTE: /api/translate
 * High-performance neural translation between languages using Gemini 3.5 Flash
 */
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang, tone } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text content is required for translation' });
    }

    const targetLanguage = targetLang || 'Bengali';
    const sourceLanguage = sourceLang || 'Auto-Detect';
    const translationTone = tone || 'Professional';

    const ai = getAiClient();
    const prompt = `You are an elite, context-aware multilingual translation system.
Translate the following text from ${sourceLanguage} to ${targetLanguage}.

Directives:
1. Tone/Style: Output the translation in a ${translationTone} tone.
2. Integrity: Preserve the original format, layout, code blocks, technical terms, and paragraph structures.
3. Content: Do NOT add any extra introductory words, explanations, conversational filler, or markdown commentary. Only return the final, pure translated text.

Input Text to Translate:
"""
${text}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });

    const translatedText = response.text || '';
    res.json({ translatedText });
  } catch (error: any) {
    console.error('Translation route error:', error);
    res.status(500).json({ error: error.message || 'Failed to translate text' });
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
            prebuiltVoiceConfig: { voiceName: voiceName || 'Puck' }, // Kore, Puck, Charon, Fenrir, Zephyr
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

    const voiceGender = urlParams.get('voice') || 'male';
    const language = urlParams.get('lang') || 'bn-BD';
    const assistantName = urlParams.get('name') || 'Jarvis';
    const userNickname = urlParams.get('nickname') || 'স্যার';

    // Map voiceGender to prebuilt Gemini voice name (Puck for male/deep, Zephyr for female)
    // Puck is highly heavy, baritone, wise, serious, and deeply thoughtful - exactly matching the requested thick tone.
    const voiceName = voiceGender === 'female' ? 'Zephyr' : 'Puck';

    // Customize system instructions based on language and custom assistant name
    let sysInstruction = `You are "${assistantName}", an ultra-advanced, context-aware AI Executive Assistant.
The user's name/preferred title is "${userNickname}". You MUST always address them as "${userNickname} স্যার" with extreme respect and loyalty.
You are speaking directly with "${userNickname} স্যার" over a real-time, high-fidelity voice channel. Keep responses sharp, respectful, and concise.

CRITICAL GREETING DIRECTIVE:
- When initiating or starting your very first audio response or dialogue in this session, you MUST politely say: "হ্যালো ${userNickname} স্যার, নমস্কার।" (or equivalent in English/Hindi depending on active language) to greet them warmly.
- For all subsequent turns/exchanges in this same conversation session, do NOT repeat the greeting or "নমস্কার" (Namaskar) to maintain professional elegance. Simply reply directly, keeping a deeply polite, respectful, and serious tone.

VOICE CHARACTERISTICS:
Maintain a deeply polite, calm, serious, and thoughtful "Chief of Staff" persona. Speak in a steady, dignified, and heavy manner that indicates profound wisdom.

Memory & Adaptive Intellect:
Listen intently to everything ${userNickname} স্যার mentions. Understand their preferences, names, and requests, and adapt your cognitive core dynamically.

Always speak in natural, polite and respectful `;

    if (language === 'hi-IN') {
      sysInstruction += `Hindi (हिन्दी) language. Keep answers very brief and dignified.`;
    } else if (language === 'en-US') {
      sysInstruction += `English language. Keep answers very brief and dignified.`;
    } else {
      sysInstruction += `Bengali (বাংলা) language. Keep answers very brief and dignified.`;
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

// Upgrade HTTP requests on /live path to WebSockets safely
server.on('upgrade', (request, socket, head) => {
  try {
    let pathname = '';
    if (request.url) {
      try {
        // Correctly parse absolute URLs (http://, https://, ws://, wss://) and relative URLs gracefully
        pathname = new URL(request.url, 'http://localhost').pathname;
      } catch (e) {
        pathname = request.url.split('?')[0];
      }
    }

    if (pathname === '/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      // If it's not the live voice route, let it close or be handled if needed
      socket.destroy();
    }
  } catch (err) {
    console.error('WebSocket upgrade processing error:', err);
    try {
      socket.destroy();
    } catch (e) {}
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
