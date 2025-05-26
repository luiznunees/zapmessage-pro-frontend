
import React, { useState } from 'react';
import { Send, Paperclip, Sparkles, MessageCircle, Settings, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import PhotoUploadModal from './PhotoUploadModal';
import AISuggestionModal from './AISuggestionModal';
import MessagePreview from './MessagePreview';

const ZapMessagePro = () => {
  const [message, setMessage] = useState('');
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [selectedList, setSelectedList] = useState('');
  const [batchSize, setBatchSize] = useState(50);
  const [minInterval, setMinInterval] = useState(5);
  const [maxInterval, setMaxInterval] = useState(15);
  const [randomInterval, setRandomInterval] = useState(true);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const contactLists = [
    'Clientes VIP',
    'Leads Frios',
    'Aniversariantes',
    'Novos Cadastros',
    'Clientes Ativos'
  ];

  const handlePhotoUpload = (photoUrl: string) => {
    setAttachedPhoto(photoUrl);
    setIsPhotoModalOpen(false);
    toast({
      title: "Foto anexada",
      description: "A imagem foi anexada com sucesso à sua mensagem.",
    });
  };

  const handleRemovePhoto = () => {
    setAttachedPhoto(null);
    toast({
      title: "Foto removida",
      description: "A imagem foi removida da mensagem.",
    });
  };

  const handleAISuggestion = (suggestedText: string) => {
    setMessage(suggestedText);
    setIsAIModalOpen(false);
    toast({
      title: "Sugestão aplicada",
      description: "O texto foi melhorado pela IA.",
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite uma mensagem antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedList) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma lista de contatos.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    console.log("Enviando mensagem para o webhook...");

    try {
      const payload = {
        message: message.trim(),
        photoUrl: attachedPhoto,
        contactList: selectedList,
        batchSize,
        minInterval,
        maxInterval,
        randomInterval,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('https://n8n.andersonnunes.net/webhook/whatsapp-message-sender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      toast({
        title: "✅ Envio agendado com sucesso!",
        description: `Mensagem será enviada para ${selectedList} em lotes de ${batchSize}.`,
      });

      // Reset form
      setMessage('');
      setAttachedPhoto(null);
      setSelectedList('');
      setBatchSize(50);
      setMinInterval(5);
      setMaxInterval(15);
      setRandomInterval(true);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro no envio",
        description: "Falha ao agendar o envio. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-whatsapp-background">
      {/* Header */}
      <div className="bg-whatsapp-primaryDark text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8" />
            <h1 className="text-xl font-semibold">ZapMessage Pro</h1>
          </div>
          <div className="flex items-center gap-4">
            <Settings className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" />
            <History className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Message Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="min-h-[120px] border-none resize-none focus:ring-0 text-base leading-relaxed"
              style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPhotoModalOpen(true)}
                className="text-whatsapp-gray hover:text-whatsapp-primary transition-colors"
              >
                <Paperclip className="w-5 h-5 mr-2" />
                Anexar Foto
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAIModalOpen(true)}
                className="text-whatsapp-gray hover:text-whatsapp-primary transition-colors"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Sugestão AI
              </Button>
            </div>
          </div>
        </div>

        {/* Message Preview */}
        <MessagePreview message={message} attachedPhoto={attachedPhoto} />

        {/* Send Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3">
            Configurações de Envio
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact-list" className="text-sm font-medium text-gray-700">
                Enviar para lista:
              </Label>
              <Select value={selectedList} onValueChange={setSelectedList}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Selecione uma lista..." />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  {contactLists.map((list) => (
                    <SelectItem key={list} value={list} className="hover:bg-whatsapp-lightGray">
                      {list}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-size" className="text-sm font-medium text-gray-700">
                Lote (mensagens):
              </Label>
              <Input
                id="batch-size"
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="rounded-xl border-gray-200"
                min="1"
                max="1000"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">Intervalo entre envios:</Label>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Label htmlFor="min-interval" className="text-sm text-gray-600">Entre</Label>
                <Input
                  id="min-interval"
                  type="number"
                  value={minInterval}
                  onChange={(e) => setMinInterval(Number(e.target.value))}
                  className="w-20 rounded-lg border-gray-200"
                  min="1"
                />
              </div>
              <span className="text-sm text-gray-600">e</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={maxInterval}
                  onChange={(e) => setMaxInterval(Number(e.target.value))}
                  className="w-20 rounded-lg border-gray-200"
                  min="1"
                />
                <Label className="text-sm text-gray-600">segundos</Label>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="random-interval"
                checked={randomInterval}
                onCheckedChange={setRandomInterval}
                className="border-whatsapp-primary data-[state=checked]:bg-whatsapp-primary"
              />
              <Label htmlFor="random-interval" className="text-sm text-gray-700">
                Intervalo aleatório
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Send Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={handleSendMessage}
          disabled={isSending}
          className="w-16 h-16 rounded-full bg-whatsapp-primary hover:bg-whatsapp-primary/90 shadow-lg transition-all duration-200 hover:scale-105"
        >
          {isSending ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>

      {/* Modals */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onUpload={handlePhotoUpload}
        attachedPhoto={attachedPhoto}
        onRemovePhoto={handleRemovePhoto}
      />

      <AISuggestionModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentMessage={message}
        onApplySuggestion={handleAISuggestion}
      />
    </div>
  );
};

export default ZapMessagePro;
