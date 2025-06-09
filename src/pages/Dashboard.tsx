
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, MessageSquare, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Dados mockados para demonstração
  const stats = [
    {
      title: "Mensagens Enviadas",
      value: "1,247",
      change: "+12.5%",
      icon: MessageSquare,
      color: "text-green-600"
    },
    {
      title: "Contatos Ativos", 
      value: "3,891",
      change: "+8.2%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Taxa de Entrega",
      value: "94.2%",
      change: "+2.1%", 
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Campanhas Ativas",
      value: "12",
      change: "+3",
      icon: BarChart3,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Visão geral das suas campanhas e métricas
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-600">
                <span className="text-green-600">{stat.change}</span> desde o último mês
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos e atividade recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Campanha enviada</p>
                    <p className="text-xs text-gray-500">Lista: Condominios Centro - 150 contatos</p>
                  </div>
                  <span className="text-xs text-gray-400">2h atrás</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status das Instâncias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Instância 01", phone: "+55 11 99999-0001", status: "connected" },
                { name: "Instância 02", phone: "+55 11 99999-0002", status: "connected" },
                { name: "Instância 03", phone: "+55 11 99999-0003", status: "disconnected" },
              ].map((instance) => (
                <div key={instance.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-900">{instance.name}</p>
                    <p className="text-sm text-gray-500">{instance.phone}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    instance.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
