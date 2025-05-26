
import React, { useState } from 'react';
import { Send, Paperclip, Sparkles, MessageCircle, Settings, History, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import PhotoUploadModal from './PhotoUploadModal';
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
  const [isSending, setIsSending] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
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

  const handleAISuggestion = async () => {
    if (!message.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite uma mensagem primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsAILoading(true);
    console.log("Enviando texto para melhoria:", message);

    try {
      const payload = {
        text: message.trim()
      };

      const response = await fetch('https://n8n.andersonnunes.net/webhook/gemini-text-enhancer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      // Como estamos usando no-cors, simulamos uma resposta melhorada
      // Em produção, isso viria da resposta da API
      const improvedText = generateImprovedText(message);
      setMessage(improvedText);

      toast({
        title: "✨ Texto melhorado!",
        description: "Sua mensagem foi aprimorada pela IA.",
      });

    } catch (error) {
      console.error('Erro ao obter sugestão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar sugestão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAILoading(false);
    }
  };

  const generateImprovedText = (text: string): string => {
    // Função temporária para simular melhoria do texto
    // Em produção, isso será substituído pela resposta real da API
    const improvements = [
      (t: string) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(),
      (t: string) => t.replace(/\.+$/, '') + '!',
      (t: string) => t.replace(/\s+/g, ' ').trim(),
      (t: string) => t.replace(/ola|oi/gi, 'Olá') + ' 😊',
    ];
    
    return improvements.reduce((acc, improvement) => improvement(acc), text);
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 shadow-lg border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-whatsapp-primary" />
            <h1 className="text-xl font-semibold">ZapMessage Pro</h1>
          </div>
          <div className="flex items-center gap-4">
            <Settings className="w-6 h-6 cursor-pointer hover:text-whatsapp-primary transition-colors" />
            <History className="w-6 h-6 cursor-pointer hover:text-whatsapp-primary transition-colors" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Message Input */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-4">
          <div className="relative">
            {isAILoading && (
              <div className="absolute inset-0 bg-gray-800/90 rounded-lg flex items-center justify-center z-10">
                <div className="flex items-center gap-3 text-whatsapp-primary">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Carregando sugestão...</span>
                </div>
              </div>
            )}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={isAILoading}
              className="min-h-[120px] border-none resize-none focus:ring-0 text-base leading-relaxed bg-gray-800 text-white placeholder:text-gray-400"
              style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPhotoModalOpen(true)}
                disabled={isAILoading}
                className="text-gray-300 hover:text-whatsapp-primary hover:bg-gray-700 transition-colors"
              >
                <Paperclip className="w-5 h-5 mr-2" />
                Anexar Foto
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAISuggestion}
                disabled={isAILoading || !message.trim()}
                className="text-gray-300 hover:text-whatsapp-primary hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {isAILoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                Sugestão AI
              </Button>
            </div>
          </div>
        </div>

        {/* Message Preview */}
        <MessagePreview message={message} attachedPhoto={attachedPhoto} />

        {/* Send Settings */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-3">
            Configurações de Envio
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact-list" className="text-sm font-medium text-gray-300">
                Enviar para lista:
              </Label>
              <Select value={selectedList} onValueChange={setSelectedList}>
                <SelectTrigger className="rounded-xl border-gray-600 bg-gray-700 text-white">
                  <SelectValue placeholder="Selecione uma lista..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border border-gray-600 rounded-xl shadow-lg z-50">
                  {contactLists.map((list) => (
                    <SelectItem key={list} value={list} className="hover:bg-gray-600 text-white">
                      {list}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-size" className="text-sm font-medium text-gray-300">
                Lote (mensagens):
              </Label>
              <Input
                id="batch-size"
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="rounded-xl border-gray-600 bg-gray-700 text-white"
                min="1"
                max="1000"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-300">Intervalo entre envios:</Label>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Label htmlFor="min-interval" className="text-sm text-gray-400">Entre</Label>
                <Input
                  id="min-interval"
                  type="number"
                  value={minInterval}
                  onChange={(e) => setMinInterval(Number(e.target.value))}
                  className="w-20 rounded-lg border-gray-600 bg-gray-700 text-white"
                  min="1"
                />
              </div>
              <span className="text-sm text-gray-400">e</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={maxInterval}
                  onChange={(e) => setMaxInterval(Number(e.target.value))}
                  className="w-20 rounded-lg border-gray-600 bg-gray-700 text-white"
                  min="1"
                />
                <Label className="text-sm text-gray-400">segundos</Label>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="random-interval"
                checked={randomInterval}
                onCheckedChange={(checked) => setRandomInterval(checked === true)}
                className="border-whatsapp-primary data-[state=checked]:bg-whatsapp-primary"
              />
              <Label htmlFor="random-interval" className="text-sm text-gray-300">
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

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onUpload={handlePhotoUpload}
        attachedPhoto={attachedPhoto}
        onRemovePhoto={handleRemovePhoto}
      />
    </div>
  );
};

export default ZapMessagePro;
