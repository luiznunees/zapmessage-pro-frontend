
import React from 'react';
import { Bell, AlertTriangle, CheckCircle, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotificationsContext } from '@/contexts/NotificationsContext';

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss,
  } = useNotificationsContext();

  const handleTryReconnect = (instanceId: string) => {
    // Implementar lógica de reconexão
    console.log('Tentando reconectar instância:', instanceId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reconnection_expired':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'campaign_completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'reconnection_expired':
        return <Badge className="bg-orange-100 text-orange-800">Ação Necessária</Badge>;
      case 'campaign_completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} min atrás`;
    } else {
      return `${diffHours}h atrás`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
          <p className="text-gray-600">
            Acompanhe alertas e atualizações do sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800">
              {unreadCount} não lidas
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Marcar todas como lidas
          </Button>
        </div>
      </div>

      {/* Lista de notificações */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`transition-all ${
              notification.isRead
                ? 'bg-white border-gray-200'
                : 'bg-blue-50 border-blue-200 shadow-md'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {getNotificationIcon(notification.type)}
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    {getNotificationBadge(notification.type)}
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-3">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(notification.timestamp)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {notification.type === 'reconnection_expired' && notification.instanceId && (
                        <Button
                          onClick={() => handleTryReconnect(notification.instanceId!)}
                          size="sm"
                          className="bg-[#2e86de] hover:bg-[#2e86de]/90"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Tentar Novamente
                        </Button>
                      )}
                      
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Marcar como lida
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismiss(notification.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {notifications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-gray-600">
                Quando houver alertas ou atualizações, eles aparecerão aqui.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;
