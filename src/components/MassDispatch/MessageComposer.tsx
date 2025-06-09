
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Paperclip, Image, FileText, X, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MessageComposerProps {
  message: string;
  onMessageChange: (message: string) => void;
  attachedMedia: { url: string; type: 'image' | 'pdf' | 'document'; name: string } | null;
  onMediaAttach: (media: { url: string; type: 'image' | 'pdf' | 'document'; name: string }) => void;
  onMediaRemove: () => void;
  onAIEnhance: () => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  message,
  onMessageChange,
  attachedMedia,
  onMediaAttach,
  onMediaRemove,
  onAIEnhance
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    let type: 'image' | 'pdf' | 'document' = 'document';
    
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type === 'application/pdf') type = 'pdf';
    
    onMediaAttach({ url, type, name: file.name });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Compose sua mensagem
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campo de mensagem */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium text-gray-700">
            Mensagem
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Digite sua mensagem aqui..."
            className="min-h-[120px] resize-none border-gray-300 focus:border-[#2e86de] focus:ring-[#2e86de]"
          />
        </div>

        {/* Área de anexo */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragOver 
              ? 'border-[#2e86de] bg-[#2e86de]/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          {attachedMedia ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {attachedMedia.type === 'image' && <Image className="w-6 h-6 text-green-600" />}
                {attachedMedia.type === 'pdf' && <FileText className="w-6 h-6 text-red-600" />}
                {attachedMedia.type === 'document' && <Paperclip className="w-6 h-6 text-blue-600" />}
                <div>
                  <p className="font-medium text-gray-900">{attachedMedia.name}</p>
                  <p className="text-sm text-gray-500">
                    {attachedMedia.type === 'image' ? 'Imagem' : 
                     attachedMedia.type === 'pdf' ? 'PDF' : 'Documento'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMediaRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Arraste um arquivo aqui ou clique para anexar
              </p>
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
                id="file-upload"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Escolher arquivo
                </label>
              </Button>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex justify-between items-center pt-2">
          <Button
            variant="outline"
            onClick={onAIEnhance}
            disabled={!message.trim()}
            className="text-[#2e86de] border-[#2e86de] hover:bg-[#2e86de]/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Melhorar com IA
          </Button>
          
          <div className="text-sm text-gray-500">
            {message.length}/1000 caracteres
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
