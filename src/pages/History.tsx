
import React, { useState } from 'react';
import { History as HistoryIcon, Search, Filter, MessageSquare, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Instance } from '@/types';

interface HistoryProps {
  selectedInstance: Instance | null;
}

const History: React.FC<HistoryProps> = ({ selectedInstance }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Dados mockados para demonstração
  const historyItems = [
    {
      id: '1',
      instanceName: 'Instância 01',
      listName: 'Condominios Centro',
      message: 'Boa tarde! Temos uma oferta especial para seu condomínio...',
      messageType: 'text' as const,
      status: 'sent' as const,
      sentAt: '2024-01-20T14:30:00',
      totalSent: 150,
      totalDelivered: 147,
      totalFailed: 3
    },
    {
      id: '2',
      instanceName: 'Instância 02', 
      listName: 'Leads Zona Sul',
      message: 'Confira nosso novo empreendimento!',
      messageType: 'media' as const,
      status: 'sent' as const,
      sentAt: '2024-01-19T10:15:00',
      totalSent: 89,
      totalDelivered: 85,
      totalFailed: 4
    },
    {
      id: '3',
      instanceName: 'Instância 01',
      listName: 'Prospects Bairro Alto',
      message: 'Olá! Gostaríamos de apresentar...',
      messageType: 'text' as const,
      status: 'error' as const,
      sentAt: '2024-01-18T16:45:00',
      totalSent: 0,
      totalDelivered: 0,
      totalFailed: 234
    }
  ];

  const filteredHistory = historyItems.filter(item => {
    const matchesSearch = item.listName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.messageType === typeFilter;
    const matchesInstance = !selectedInstance || item.instanceName.includes(selectedInstance.name);
    
    return matchesSearch && matchesStatus && matchesType && matchesInstance;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800">Enviado</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Erro</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'media':
        return <Image className="w-4 h-4 text-blue-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-red-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórico</h1>
          <p className="text-gray-600">
            Visualize o histórico de disparos e campanhas anteriores
          </p>
        </div>
        {selectedInstance && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Filtrando por:</p>
            <p className="font-semibold text-gray-900">{selectedInstance.name}</p>
          </div>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por lista, mensagem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="sent">Enviado</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Tipos</SelectItem>
                <SelectItem value="text">Texto</SelectItem>
                <SelectItem value="media">Mídia</SelectItem>
                <SelectItem value="document">Documento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista do histórico */}
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{item.listName}</h3>
                    {getMessageTypeIcon(item.messageType)}
                    {getStatusBadge(item.status)}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.message}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Instância: {item.instanceName}</span>
                    <span>
                      Enviado em: {new Date(item.sentAt).toLocaleString('pt-BR')}
                    </span>
                    {item.status === 'sent' && (
                      <>
                        <span className="text-green-600">
                          Entregues: {item.totalDelivered}
                        </span>
                        {item.totalFailed > 0 && (
                          <span className="text-red-600">
                            Falhas: {item.totalFailed}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {item.totalSent}
                  </p>
                  <p className="text-sm text-gray-500">contatos</p>
                </div>
              </div>

              {/* Barra de progresso para taxa de entrega */}
              {item.status === 'sent' && item.totalSent > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Taxa de entrega</span>
                    <span>
                      {Math.round((item.totalDelivered / item.totalSent) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(item.totalDelivered / item.totalSent) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredHistory.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <HistoryIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">
                Nenhum registro encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Tente ajustar os filtros para ver mais resultados.'
                  : 'Quando você enviar campanhas, elas aparecerão aqui.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default History;
