export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  audioUrl?: string;
  groundingChunks?: Array<{
    title?: string;
    uri?: string;
    snippet?: string;
  }>;
  modelUsed?: string;
  searchTriggered?: boolean;
  mapsTriggered?: boolean;
  timestamp: Date;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  notes?: string;
}

export interface WorkspaceEmail {
  id: string;
  subject: string;
  from: string;
  to?: string;
  snippet: string;
  body?: string;
  date: string;
}

export interface WorkspaceEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  htmlLink?: string;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
}

export interface SystemCommandResult {
  command: string;
  arguments: Record<string, any>;
  message: string;
}
