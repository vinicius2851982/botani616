import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Item, ItemStatus, Quotation } from '@/lib/types';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useItems() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const itemsQuery = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return data as Item[];
    },
    enabled: !!user,
  });

  const quotationsQuery = useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('price', { ascending: true });
      if (error) throw error;
      return data as Quotation[];
    },
    enabled: !!user,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ItemStatus }) => {
      const { error } = await supabase.from('items').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  });

  const addItem = useMutation({
    mutationFn: async (item: { name: string; category: string; quantity: number }) => {
      const { error } = await supabase.from('items').insert({
        ...item,
        user_id: user!.id,
        status: 'Pendente' as ItemStatus,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item adicionado!');
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; category?: string; quantity?: number; status?: ItemStatus }) => {
      const { error } = await supabase.from('items').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item atualizado!');
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item removido!');
    },
  });

  const addQuotation = useMutation({
    mutationFn: async (q: { item_id: string; store_name: string; price: number; link?: string }) => {
      const { error } = await supabase.from('quotations').insert({
        ...q,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Cotação adicionada!');
    },
  });

  const deleteQuotation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('quotations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Cotação removida!');
    },
  });

  return {
    items: itemsQuery.data ?? [],
    quotations: quotationsQuery.data ?? [],
    isLoading: itemsQuery.isLoading,
    updateStatus,
    addItem,
    updateItem,
    deleteItem,
    addQuotation,
    deleteQuotation,
  };
}
