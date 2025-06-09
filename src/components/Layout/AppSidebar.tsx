
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Upload, 
  List, 
  Calendar, 
  History, 
  Bell,
  BarChart3
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Disparo em Massa",
    url: "/",
    icon: MessageSquare,
  },
  {
    title: "Upload de Listagem",
    url: "/upload",
    icon: Upload,
  },
  {
    title: "Minhas Listagens",
    url: "/lists",
    icon: List,
  },
  {
    title: "Agendamentos",
    url: "/schedule",
    icon: Calendar,
  },
  {
    title: "Histórico",
    url: "/history",
    icon: History,
  },
  {
    title: "Notificações",
    url: "/notifications",
    icon: Bell,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="bg-[#1e1e2f]">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[#2e86de]" />
          <h1 className="text-xl font-semibold text-white">ZapMessage Pro</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 uppercase text-xs font-semibold mb-4">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        "hover:bg-[#2e86de]/10 hover:text-[#2e86de]",
                        location.pathname === item.url
                          ? "bg-[#2e86de]/20 text-[#2e86de] border-r-2 border-[#2e86de]"
                          : "text-gray-300"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
