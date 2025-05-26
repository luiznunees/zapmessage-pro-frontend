
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContactList {
  id: number;
  Condominio: string;
  Status_Envio: string;
  Telefone: string;
  Email: string;
  Ultimo_Envio: string;
}

export const useContactLists = () => {
  return useQuery({
    queryKey: ['contact-lists'],
    queryFn: async (): Promise<ContactList[]> => {
      console.log('Buscando listas de contatos do Supabase...');
      
      const { data, error } = await supabase
        .from('Leads_Condominios')
        .select('*')
        .order('Condominio', { ascending: true });

      if (error) {
        console.error('Erro ao buscar listas de contatos:', error);
        throw new Error('Falha ao carregar listas de contatos');
      }

      console.log('Listas carregadas:', data);
      return data || [];
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
