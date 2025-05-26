
import React from 'react';

interface MessagePreviewProps {
  message: string;
  attachedPhoto: string | null;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({ message, attachedPhoto }) => {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!message.trim() && !attachedPhoto) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Pré-visualização da Mensagem</h3>
        <div className="text-center text-gray-500 py-8">
          <p className="text-sm">Digite uma mensagem para ver a pré-visualização</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
      <h3 className="text-sm font-medium text-gray-300 mb-4">Pré-visualização da Mensagem</h3>
      
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 bg-whatsapp-primary rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          EU
        </div>
        
        {/* Message Bubble */}
        <div className="flex-1">
          <div className="bg-whatsapp-secondary rounded-2xl rounded-bl-md p-3 max-w-sm ml-auto relative shadow-sm">
            {/* Photo Preview */}
            {attachedPhoto && (
              <div className="mb-2">
                <img 
                  src={attachedPhoto} 
                  alt="Anexo" 
                  className="w-full max-w-xs rounded-lg object-cover"
                />
              </div>
            )}
            
            {/* Message Text */}
            {message.trim() && (
              <p className="text-gray-800 text-sm leading-relaxed break-words whitespace-pre-wrap">
                {message}
              </p>
            )}
            
            {/* Timestamp and Status */}
            <div className="flex items-center justify-end gap-1 mt-2">
              <span className="text-xs text-gray-500">{getCurrentTime()}</span>
              <div className="flex gap-0.5">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePreview;
