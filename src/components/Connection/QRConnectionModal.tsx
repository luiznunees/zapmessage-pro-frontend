
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, QrCode, CheckCircle, AlertCircle } from 'lucide-react';

interface QRConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  instanceId: string;
}

export const QRConnectionModal: React.FC<QRConnectionModalProps> = ({
  isOpen,
  onClose,
  instanceId
}) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'qr-ready' | 'connecting' | 'connected' | 'error'>('loading');
  const [countdown, setCountdown] = useState(120); // 2 minutos

  useEffect(() => {
    if (isOpen && instanceId) {
      startReconnection();
    }
  }, [isOpen, instanceId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status === 'qr-ready' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setStatus('error');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status, countdown]);

  const startReconnection = async () => {
    try {
      setStatus('loading');
      setCountdown(120);
      
      // Solicitar QR Code
      const response = await fetch(`https://n8n.andersonnunes.net/webhook/reconectarWhatsapp?id=${instanceId}`);
      const data = await response.json();
      
      if (data.qrCode) {
        setQrCode(data.qrCode);
        setStatus('qr-ready');
        startPolling();
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Erro ao solicitar QR Code:', error);
      setStatus('error');
    }
  };

  const startPolling = () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`https://n8n.andersonnunes.net/webhook/statusWhatsapp?id=${instanceId}`);
        const data = await response.json();
        
        if (data.status === 'connected') {
          setStatus('connected');
          clearInterval(pollInterval);
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch (error) {
        console.error('Erro no polling:', error);
      }
    }, 3000);

    // Limpar polling após 2 minutos
    setTimeout(() => {
      clearInterval(pollInterval);
      if (status !== 'connected') {
        setStatus('error');
      }
    }, 120000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Conectar WhatsApp</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#2e86de]" />
              <p className="text-gray-600">Gerando QR Code...</p>
            </div>
          )}

          {status === 'qr-ready' && qrCode && (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Escaneie o QR Code com seu WhatsApp
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>1. Abra o WhatsApp no seu celular</p>
                  <p>2. Toque em Menu → Dispositivos conectados</p>
                  <p>3. Toque em "Conectar dispositivo"</p>
                  <p>4. Escaneie este código</p>
                </div>
                
                <div className="text-sm font-medium text-orange-600">
                  Expira em: {formatTime(countdown)}
                </div>
              </div>
            </div>
          )}

          {status === 'connecting' && (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-green-500" />
              <p className="text-gray-600">Conectando...</p>
            </div>
          )}

          {status === 'connected' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <p className="text-green-600 font-medium">WhatsApp conectado com sucesso!</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <p className="text-red-600">Falha na conexão</p>
              <p className="text-sm text-gray-600">
                O QR Code expirou ou houve um erro. Tente novamente.
              </p>
              <Button onClick={startReconnection} className="bg-[#2e86de] hover:bg-[#2e86de]/90">
                Tentar Novamente
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
