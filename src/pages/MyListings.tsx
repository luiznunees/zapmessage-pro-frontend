
import React, { useState } from 'react';
import { Search, List, Users, Calendar, MoreVertical, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MyListings = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dados mockados para demonstração
  const listings = [
    {
      id: '1',
      name: 'Condominios Centro',
      totalContacts: 150,
      uploadedAt: '2024-01-15',
      status: 'active',
      lastUsed: '2024-01-20'
    },
    {
      id: '2', 
      name: 'Leads Zona Sul',
      totalContacts: 89,
      uploadedAt: '2024-01-12',
      status: 'active',
      lastUsed: '2024-01-18'
    },
    {
      id: '3',
      name: 'Prospects Bairro Alto', 
      totalContacts: 234,
      uploadedAt: '2024-01-10',
      status: 'archived',
      lastUsed: '2024-01-15'
    },
    {
      id: '4',
      name: 'Clientes Premium',
      totalContacts: 45,
      uploadedAt: '2024-01-08',
      status: 'active',
      lastUsed: null
    }
  ];

  const filteredListings = listings.filter(listing =>
    listing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUseInDispatch = (listingId: string) => {
    // Navegar para página de disparo com lista selecionada
    console.log('Usar lista no disparo:', listingId);
  };

  const handleViewDetails = (listingId: string) => {
    console.log('Ver detalhes da lista:', listingId);
  };

  const handleDeleteListing = (listingId: string) => {
    console.log('Deletar lista:', listingId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Listagens</h1>
          <p className="text-gray-600">
            Gerencie suas listas de contatos e histórico de uploads
          </p>
        </div>
        <Button className="bg-[#2e86de] hover:bg-[#2e86de]/90">
          Nova Listagem
        </Button>
      </div>

      {/* Barra de busca */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome da lista, número de contatos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de listagens */}
      <div className="space-y-4">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2e86de]/10 rounded-lg flex items-center justify-center">
                    <List className="w-6 h-6 text-[#2e86de]" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{listing.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{listing.totalContacts} contatos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Upload: {new Date(listing.uploadedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      {listing.lastUsed && (
                        <span>Último uso: {new Date(listing.lastUsed).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge 
                    variant={listing.status === 'active' ? 'default' : 'secondary'}
                    className={listing.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {listing.status === 'active' ? 'Ativa' : 'Arquivada'}
                  </Badge>

                  <Button
                    onClick={() => handleUseInDispatch(listing.id)}
                    className="bg-[#2e86de] hover:bg-[#2e86de]/90"
                  >
                    Usar no Disparo
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(listing.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteListing(listing.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredListings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <List className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Nenhuma listagem encontrada</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Tente ajustar sua busca ou criar uma nova listagem.'
                  : 'Comece fazendo upload da sua primeira lista de contatos.'
                }
              </p>
              <Button className="bg-[#2e86de] hover:bg-[#2e86de]/90">
                Nova Listagem
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyListings;
