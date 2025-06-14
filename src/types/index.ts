
export interface Instance {
  id: string;
  name: string;
  phone: string;
  status: 'connected' | 'disconnected';
}

export interface ContactList {
  id: string;
  name: string;
  totalContacts: number;
  uploadedAt: string;
  status: string;
}

export interface Message {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'pdf' | 'document';
}

export interface Campaign {
  id: string;
  instanceId: string;
  listId: string;
  message: Message;
  batchSize: number;
  minInterval: number;
  maxInterval: number;
  status: 'pending' | 'sending' | 'completed' | 'error';
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  instanceName: string;
  listName: string;
  messageType: 'text' | 'media';
  status: 'sent' | 'error';
  sentAt: string;
  totalSent: number;
}

export interface ScheduledMessage {
  id: string;
  instanceId: string;
  listId: string;
  message: string;
  scheduledFor: string;
  status: 'scheduled' | 'sent' | 'cancelled';
}

export interface Notification {
  id: string;
  type: 'reconnection_expired' | 'campaign_completed' | 'info';
  title: string;
  message: string;
  instanceId?: string;
  instanceName?: string;
  timestamp: Date;
  isRead: boolean;
}
