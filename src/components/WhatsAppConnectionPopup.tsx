
import React from 'react';
import { QrCode, Wifi, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface WhatsAppConnectionPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const WhatsAppConnectionPopup = ({ isOpen, onOpenChange }: WhatsAppConnectionPopupProps) => {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-whatsapp-primary hover:bg-gray-700 transition-colors"
        >
          <Wifi className="w-6 h-6" />
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
