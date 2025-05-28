
import React, { useState } from 'react';
import { Construction, MessageCircle, Settings, History } from 'lucide-react';
import Navigation from '../components/Navigation';
import WhatsAppConnectionPopup from '../components/WhatsAppConnectionPopup';

const Extraction = () => {
  const [isWhatsAppPopupOpen, setIsWhatsAppPopupOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 shadow-lg border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-whatsapp-primary" />
              <h1 className="text-xl font-semibold">ZapMessage Pro</h1>
            </div>
            <Navigation />
          </div>
          <div className="flex items-center gap-4">
            <WhatsAppConnectionPopup 
              isOpen={isWhatsAppPopupOpen}
              onOpenChange={setIsWhatsAppPopupOpen}
              connectionStatus="disconnected"
            />
            <Settings className="w-6 h-6 cursor-pointer hover:text-whatsapp-primary transition-colors" />
            <History className="w-6 h-6 cursor-pointer hover:text-whatsapp-primary transition-colors" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="text-center space-y-6">
          <Construction className="w-24 h-24 text-gray-400 mx-auto" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Em Construção</h1>
            <p className="text-gray-400 text-lg">
              Esta página está sendo desenvolvida e estará disponível em breve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extraction;
