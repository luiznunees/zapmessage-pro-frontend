
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { Header } from "@/components/Layout/Header";
import { useInstances } from "@/hooks/useInstances";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UploadListing from "./pages/UploadListing";
import MyListings from "./pages/MyListings";
import Schedule from "./pages/Schedule";
import History from "./pages/History";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { instances, selectedInstance, selectInstance, checkInstanceStatus } = useInstances();

  const handleReconnect = () => {
    if (selectedInstance) {
      checkInstanceStatus(selectedInstance.id);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#f5f7fa]">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header 
            instances={instances}
            selectedInstance={selectedInstance}
            onSelectInstance={selectInstance}
            onReconnect={handleReconnect}
          />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Index selectedInstance={selectedInstance} />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadListing />} />
              <Route path="/lists" element={<MyListings />} />
              <Route path="/schedule" element={<Schedule selectedInstance={selectedInstance} />} />
              <Route path="/history" element={<History selectedInstance={selectedInstance} />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
