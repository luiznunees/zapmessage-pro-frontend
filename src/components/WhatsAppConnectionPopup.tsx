
import React from 'react';
import { QrCode, Wifi, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface WhatsAppConnectionPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  connectionStatus?: 'connected' | 'disconnected' | 'about-to-disconnect';
}

const WhatsAppConnectionPopup = ({ 
  isOpen, 
  onOpenChange, 
  connectionStatus = 'disconnected' 
}: WhatsAppConnectionPopupProps) => {
  
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          text: 'Conectado',
          borderColor: 'border-green-500',
          textColor: 'text-green-400',
          bgColor: 'hover:bg-green-500/10'
        };
      case 'about-to-disconnect':
        return {
          text: 'Prestes a Desconectar',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-400',
          bgColor: 'hover:bg-yellow-500/10'
        };
      default:
        return {
          text: 'Conectar WhatsApp',
          borderColor: 'border-red-500',
          textColor: 'text-red-400',
          bgColor: 'hover:bg-red-500/10'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`
            ${statusConfig.borderColor} 
            ${statusConfig.textColor} 
            ${statusConfig.bgColor}
            border-2 px-4 py-2 transition-all duration-200 flex items-center gap-2
          `}
        >
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">{statusConfig.text}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-6 bg-gray-800 border border-gray-700 shadow-lg"
        side="bottom"
        align="end"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Conectar WhatsApp</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-lg inline-block">
              <QrCode className="w-32 h-32 text-black" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                1. Abra o WhatsApp no seu celular
              </p>
              <p className="text-sm text-gray-300">
                2. Toque em Menu ou Configurações
              </p>
              <p className="text-sm text-gray-300">
                3. Toque em Dispositivos conectados
              </p>
              <p className="text-sm text-gray-300">
                4. Escaneie este QR code
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Aguardando conexão...
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WhatsAppConnectionPopup;
