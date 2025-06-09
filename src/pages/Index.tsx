
import React, { useState } from 'react';
import { Send, Users, Clock, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { MessageComposer } from '@/components/MassDispatch/MessageComposer';
import { Instance } from '@/types';

interface IndexProps {
  selectedInstance: Instance | null;
}

const Index: React.FC<IndexProps> = ({ selectedInstance }) => {
  const [message, setMessage] = useState('');
  const [attachedMedia, setAttachedMedia] = useState<any>(null);
  const [selectedList, setSelectedList] = useState('');
  const [batchSize, setBatchSize] = useState(50);
  const [minInterval, setMinInterval] = useState(5);
  const [maxInterval, setMaxInterval] = useState(15);
  const [randomInterval, setRandomInterval] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const { toast } = useToast();

  // Mock lists para demonstração
  const contactLists = [
    { id: '1', name: 'Condominios Centro', totalContacts: 150 },
    { id: '2', name: 'Leads Zona Sul', totalContacts: 89 },
    { id: '3', name: 'Prospects Bairro Alto', totalContacts: 234 },
  ];

  const handleAIEnhance = async () => {
    try {
      const response = await fetch('https://n8n.andersonnunes.net/webhook/gemini-text-enhancer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });
      
      const result = await response.json();
      setMessage(result.improved_text || message);
      
      toast({
        title: "✨ Texto melhorado!",
        description: "Sua mensagem foi aprimorada pela IA.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao melhorar texto com IA.",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!selectedInstance) {
      toast({
        title: "Erro",
        description: "Selecione uma instância antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Erro", 
        description: "Digite uma mensagem antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedList) {
      toast({
        title: "Erro",
        description: "Selecione uma lista de contatos.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const payload = {
        instanceId: selectedInstance.id,
        message: message.trim(),
        mediaUrl: attachedMedia?.url,
        mediaType: attachedMedia?.type,
        listId: selectedList,
        batchSize,
        minInterval,
        maxInterval,
        randomInterval,
      };

      const response = await fetch('https://n8n.andersonnunes.net/webhook/disparo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "✅ Disparo iniciado!",
          description: `Mensagens serão enviadas em lotes de ${batchSize}.`,
        });
        
        // Limpar formulário
        setMessage('');
        setAttachedMedia(null);
        setSelectedList('');
      } else {
        throw new Error('Falha no envio');
      }
    } catch (error) {
      toast({
        title: "Erro no disparo",
        description: "Falha ao iniciar o disparo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disparo em Massa</h1>
          <p className="text-gray-600">
            Envie mensagens para múltiplos contatos de forma eficiente
          </p>
        </div>
        {selectedInstance && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Instância selecionada:</p>
            <p className="font-semibold text-gray-900">{selectedInstance.name}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer de mensagem */}
        <div className="lg:col-span-2">
          <MessageComposer
            message={message}
            onMessageChange={setMessage}
            attachedMedia={attachedMedia}
            onMediaAttach={setAttachedMedia}
            onMediaRemove={() => setAttachedMedia(null)}
            onAIEnhance={handleAIEnhance}
          />
        </div>

        {/* Configurações de envio */}
        <div className="space-y-6">
          {/* Seleção de lista */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Lista de Contatos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-list">Selecionar lista</Label>
                <Select value={selectedList} onValueChange={setSelectedList}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma lista..." />
                  </SelectTrigger>
                  <SelectContent>
                    {contactLists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        <div className="flex flex-col">
                          <span>{list.name}</span>
                          <span className="text-xs text-gray-500">
                            {list.totalContacts} contatos
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de lote */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações de Envio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batch-size">Tamanho do lote</Label>
                <Input
                  id="batch-size"
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  min="1"
                  max="1000"
                />
              </div>

              <div className="space-y-3">
                <Label>Intervalo entre envios (segundos)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="min-interval" className="text-xs">Mínimo</Label>
                    <Input
                      id="min-interval"
                      type="number"
                      value={minInterval}
                      onChange={(e) => setMinInterval(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-interval" className="text-xs">Máximo</Label>
                    <Input
                      id="max-interval"
                      type="number"
                      value={maxInterval}
                      onChange={(e) => setMaxInterval(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="random-interval"
                    checked={randomInterval}
                    onCheckedChange={(checked) => setRandomInterval(checked === true)}
                  />
                  <Label htmlFor="random-interval" className="text-sm">
                    Intervalo aleatório
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão de envio */}
          <Button
            onClick={handleSend}
            disabled={isSending || !selectedInstance || selectedInstance.status !== 'connected'}
            className="w-full bg-[#2e86de] hover:bg-[#2e86de]/90 h-12"
          >
            {isSending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Iniciar Disparo
              </div>
            )}
          </Button>

          {selectedInstance?.status !== 'connected' && (
            <p className="text-sm text-red-600 text-center">
              Conecte a instância para enviar mensagens
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
