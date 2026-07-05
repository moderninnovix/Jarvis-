import { WorkspaceEmail, WorkspaceEvent, WorkspaceFile } from '../types';

async function fetchGoogleApi(endpoint: string, token: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`Google API Error on ${endpoint}:`, errText);
    throw new Error(`Google API request failed: ${response.statusText} (${errText})`);
  }

  // Some delete requests return 204 or no content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * GMAIL API Integration
 */
export async function listEmails(token: string, maxResults: number = 10): Promise<WorkspaceEmail[]> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`;
  const data = await fetchGoogleApi(url, token);
  
  if (!data.messages) return [];

  const emails: WorkspaceEmail[] = [];
  for (const msg of data.messages) {
    try {
      const details = await getEmailDetails(msg.id, token);
      emails.push(details);
    } catch (e) {
      console.error(`Error fetching email details for ${msg.id}:`, e);
    }
  }
  return emails;
}

export async function getEmailDetails(id: string, token: string): Promise<WorkspaceEmail> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`;
  const data = await fetchGoogleApi(url, token);

  const headers = data.payload?.headers || [];
  const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
  const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown';
  const to = headers.find((h: any) => h.name.toLowerCase() === 'to')?.value || 'Me';
  const dateStr = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

  // Simple body parsing
  let body = '';
  if (data.payload?.body?.data) {
    body = atob(data.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
  } else if (data.payload?.parts) {
    // Traverse parts to find plaintext
    const part = data.payload.parts.find((p: any) => p.mimeType === 'text/plain') || data.payload.parts[0];
    if (part?.body?.data) {
      body = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    }
  }

  return {
    id,
    subject,
    from,
    to,
    snippet: data.snippet || '',
    body: body || data.snippet || '',
    date: dateStr,
  };
}

export async function sendEmail(token: string, to: string, subject: string, bodyText: string): Promise<any> {
  const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
  
  // Format RFC 2822 raw message
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const rawMessage = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    bodyText
  ].join('\r\n');

  const base64Raw = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return fetchGoogleApi(url, token, {
    method: 'POST',
    body: JSON.stringify({ raw: base64Raw }),
  });
}

/**
 * CALENDAR API Integration
 */
export async function listEvents(token: string, maxResults: number = 10): Promise<WorkspaceEvent[]> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=${maxResults}&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`;
  const data = await fetchGoogleApi(url, token);
  
  if (!data.items) return [];

  return data.items.map((item: any) => ({
    id: item.id,
    summary: item.summary || '(No Title)',
    start: item.start?.dateTime || item.start?.date || '',
    end: item.end?.dateTime || item.end?.date || '',
    description: item.description || '',
    location: item.location || '',
    htmlLink: item.htmlLink,
  }));
}

export async function createEvent(token: string, event: Omit<WorkspaceEvent, 'id'>, createMeetLink: boolean = false): Promise<any> {
  let url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
  if (createMeetLink) {
    url += '?conferenceDataVersion=1';
  }

  const body: any = {
    summary: event.summary,
    description: event.description,
    location: event.location,
    start: {
      dateTime: new Date(event.start).toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: new Date(event.end).toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };

  if (createMeetLink) {
    body.conferenceData = {
      createRequest: {
        requestId: Math.random().toString(36).substring(2),
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    };
  }

  return fetchGoogleApi(url, token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function deleteEvent(token: string, eventId: string): Promise<any> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;
  return fetchGoogleApi(url, token, {
    method: 'DELETE',
  });
}

/**
 * DRIVE API Integration
 */
export async function listFiles(token: string, maxResults: number = 10): Promise<WorkspaceFile[]> {
  const url = `https://www.googleapis.com/drive/v3/files?pageSize=${maxResults}&fields=files(id,name,mimeType,modifiedTime,size,webViewLink)`;
  const data = await fetchGoogleApi(url, token);
  
  if (!data.files) return [];

  return data.files.map((file: any) => ({
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    modifiedTime: file.modifiedTime,
    size: file.size ? `${(parseInt(file.size) / (1024 * 1024)).toFixed(2)} MB` : undefined,
    webViewLink: file.webViewLink,
  }));
}

export async function uploadFile(token: string, name: string, mimeType: string, content: string): Promise<any> {
  const metadata = { name, mimeType };
  
  // Multipart upload
  const boundary = 'foo_bar_baz';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body = 
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    content +
    closeDelimiter;

  const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  return fetchGoogleApi(url, token, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });
}

/**
 * GOOGLE DOCUMENTS (DOCS) & SLIDES & SHEETS & FORMS API Integration
 */
export async function createGoogleDoc(token: string, title: string, bodyText: string): Promise<any> {
  const url = 'https://docs.googleapis.com/v1/documents';
  const doc = await fetchGoogleApi(url, token, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });

  if (doc?.documentId && bodyText) {
    const updateUrl = `https://docs.googleapis.com/v1/documents/${doc.documentId}:batchUpdate`;
    await fetchGoogleApi(updateUrl, token, {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              endOfSectionRecital: {},
              text: bodyText,
              location: { index: 1 },
            },
          },
        ],
      }),
    });
  }

  return doc;
}

export async function createGoogleSheet(token: string, title: string): Promise<any> {
  const url = 'https://sheets.googleapis.com/v4/spreadsheets';
  return fetchGoogleApi(url, token, {
    method: 'POST',
    body: JSON.stringify({
      properties: { title },
    }),
  });
}

export async function createGooglePresentation(token: string, title: string): Promise<any> {
  const url = 'https://slides.googleapis.com/v1/presentations';
  return fetchGoogleApi(url, token, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export async function createGoogleForm(token: string, title: string): Promise<any> {
  const url = 'https://forms.googleapis.com/v1/forms';
  return fetchGoogleApi(url, token, {
    method: 'POST',
    body: JSON.stringify({
      info: { title },
    }),
  });
}

/**
 * Creates a standalone Google Meet space
 */
export async function createMeetSpace(token: string): Promise<any> {
  // Creating a meet space is simplest via the Calendar API by injecting a conference on a quick placeholder event
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  
  const placeholderEvent = {
    summary: 'Jarvis Instant Meeting Space',
    description: 'Instant meeting room created by Jarvis AI Assistant.',
    start: now.toISOString(),
    end: oneHourLater.toISOString(),
  };

  const created = await createEvent(token, placeholderEvent, true);
  const meetLink = created.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri;
  
  return {
    eventId: created.id,
    meetLink: meetLink || created.htmlLink,
  };
}
