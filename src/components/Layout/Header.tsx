
import React, { useState } from 'react';
import { ChevronDown, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Instance } from '@/types';
import { QRConnectionModal } from '../Connection/QRConnectionModal';

interface HeaderProps {
  instances: Instance[];
  selectedInstance: Instance | null;
  onSelectInstance: (instance: Instance) => void;
  onReconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  instances,
  selectedInstance,
  onSelectInstance,
  onReconnect
}) => {
  const [showQRModal, setShowQRModal] = useState(false);

  const handleConnect = () => {
    setShowQRModal(true);
    onReconnect();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#2e86de] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ZM</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">ZapMessage Pro</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Seletor de Instância */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Instância:</span>
              <Select 
                value={selectedInstance?.id || ''} 
                onValueChange={(value) => {
                  const instance = instances.find(i => i.id === value);
                  if (instance) onSelectInstance(instance);
                }}
              >
                <SelectTrigger className="w-48 bg-white border-gray-300">
                  <SelectValue placeholder="Selecione uma instância" />
                </SelectTrigger>
                <SelectContent>
                  {instances.map((instance) => (
                    <SelectItem key={instance.id} value={instance.id}>
                      <div className="flex items-center gap-2">
                        <span>{instance.name}</span>
                        <span className="text-xs text-gray-500">({instance.phone})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status da Conexão */}
            {selectedInstance && (
              <div className="flex items-center gap-2">
                {selectedInstance.status === 'connected' ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm font-medium">Conectado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <WifiOff className="w-4 h-4" />
                      <span className="text-sm font-medium">Desconectado</span>
                    </div>
                    <Button
                      onClick={handleConnect}
                      variant="outline"
                      size="sm"
                      className="border-[#2e86de] text-[#2e86de] hover:bg-[#2e86de] hover:text-white"
                    >
                      Conectar
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <QRConnectionModal 
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        instanceId={selectedInstance?.id || ''}
      />
    </>
  );
};
