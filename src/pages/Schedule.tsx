
import React, { useState } from 'react';
import { Calendar, Clock, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Instance } from '@/types';

interface ScheduleProps {
  selectedInstance: Instance | null;
}

const Schedule: React.FC<ScheduleProps> = ({ selectedInstance }) => {
  const [selectedList, setSelectedList] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  const { toast } = useToast();

  // Mock lists para demonstração
  const contactLists = [
    { id: '1', name: 'Condominios Centro', totalContacts: 150 },
    { id: '2', name: 'Leads Zona Sul', totalContacts: 89 },
    { id: '3', name: 'Prospects Bairro Alto', totalContacts: 234 },
  ];

  // Mock agendamentos para demonstração
  const scheduledMessages = [
    {
      id: '1',
      listName: 'Condominios Centro',
      message: 'Boa tarde! Temos uma oferta especial...',
      scheduledFor: '2024-01-25T14:00:00',
      status: 'scheduled'
    },
    {
      id: '2', 
      listName: 'Leads Zona Sul',
      message: 'Olá! Gostaríamos de apresentar...',
      scheduledFor: '2024-01-26T09:30:00',
      status: 'scheduled'
    }
  ];

  const handleSchedule = async () => {
    if (!selectedInstance) {
      toast({
        title: "Erro",
        description: "Selecione uma instância antes de agendar.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim() || !selectedList || !scheduledDate || !scheduledTime) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsScheduling(true);

    try {
      const scheduledDateTime = `${scheduledDate}T${scheduledTime}:00`;
      
      const payload = {
        instanceId: selectedInstance.id,
        listId: selectedList,
        message: message.trim(),
        scheduledFor: scheduledDateTime,
      };

      const response = await fetch('https://n8n.andersonnunes.net/webhook/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "✅ Mensagem agendada!",
          description: "Sua mensagem será enviada no horário programado.",
        });
        
        // Limpar formulário
        setMessage('');
        setSelectedList('');
        setScheduledDate('');
        setScheduledTime('');
      } else {
        throw new Error('Falha no agendamento');
      }
    } catch (error) {
      toast({
        title: "Erro no agendamento",
        description: "Falha ao agendar mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
        <p className="text-gray-600">
          Programe o envio de mensagens para datas e horários específicos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de agendamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Novo Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seleção de lista */}
            <div className="space-y-2">
              <Label htmlFor="list-select">Lista de contatos</Label>
              <Select value={selectedList} onValueChange={setSelectedList}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma lista..." />
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

            {/* Mensagem */}
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="min-h-[100px]"
              />
            </div>

            {/* Data e hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            </div>

            {/* Instância selecionada */}
            {selectedInstance && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium text-gray-700">
                  Instância selecionada:
                </Label>
                <p className="text-sm text-gray-900 mt-1">
                  {selectedInstance.name} ({selectedInstance.phone})
                </p>
              </div>
            )}

            <Button
              onClick={handleSchedule}
              disabled={isScheduling || !selectedInstance}
              className="w-full bg-[#2e86de] hover:bg-[#2e86de]/90"
            >
              {isScheduling ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Agendando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Agendar Mensagem
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Lista de agendamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Agendamentos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledMessages.map((scheduled) => (
                <div key={scheduled.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {scheduled.listName}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {scheduled.message}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(scheduled.scheduledFor).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(scheduled.scheduledFor).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ))}

              {scheduledMessages.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    Nenhum agendamento pendente
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
