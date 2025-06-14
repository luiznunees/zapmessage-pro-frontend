
import { useState } from 'react';
import { Notification } from '@/types';

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'reconnection_expired',
    title: 'Reconexão Expirada',
    message: 'A tentativa de reconexão da Instância 01 expirou. É necessário tentar novamente.',
    instanceId: 'inst_001',
    instanceName: 'Instância 01',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isRead: false
  },
  {
    id: '2',
    type: 'campaign_completed',
    title: 'Campanha Finalizada',
    message: 'O disparo para "Condominios Centro" foi concluído com sucesso. 147 de 150 mensagens entregues.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: '3',
    type: 'reconnection_expired',
    title: 'Reconexão Expirada',
    message: 'A tentativa de reconexão da Instância 03 expirou. É necessário tentar novamente.',
    instanceId: 'inst_003',
    instanceName: 'Instância 03',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: false
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const dismiss = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss
  };
};
