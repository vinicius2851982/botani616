import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Item } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';

const SEED_ITEMS = [
  // Cozinha
  { name: 'Geladeira / Frigobar', category: 'Cozinha', quantity: 1 },
  { name: 'Micro-ondas', category: 'Cozinha', quantity: 1 },
  { name: 'Cooktop 2 bocas', category: 'Cozinha', quantity: 1 },
  { name: 'Cafeteira Nespresso', category: 'Cozinha', quantity: 1 },
  { name: 'Sanduicheira', category: 'Cozinha', quantity: 1 },
  { name: 'Jogo de Panelas Inox', category: 'Cozinha', quantity: 1 },
  { name: 'Prato Raso (Tramontina Paola)', category: 'Cozinha', quantity: 6 },
  { name: 'Prato Fundo (Tramontina Paola)', category: 'Cozinha', quantity: 6 },
  { name: 'Copo de Vidro', category: 'Cozinha', quantity: 6 },
  { name: 'Taça de Vinho', category: 'Cozinha', quantity: 6 },
  { name: 'Xícara de Chá c/ Pires', category: 'Cozinha', quantity: 6 },
  { name: 'Xícara de Café c/ Pires', category: 'Cozinha', quantity: 6 },
  { name: 'Garfo Aço Inox', category: 'Cozinha', quantity: 6 },
  { name: 'Faca Aço Inox', category: 'Cozinha', quantity: 6 },
  { name: 'Colher Aço Inox', category: 'Cozinha', quantity: 6 },
  { name: 'Colher de Café', category: 'Cozinha', quantity: 6 },
  { name: 'Colher de Servir', category: 'Cozinha', quantity: 2 },
  { name: 'Escumadeira', category: 'Cozinha', quantity: 2 },
  { name: 'Concha de Servir', category: 'Cozinha', quantity: 2 },
  { name: 'Faca de Corte', category: 'Cozinha', quantity: 1 },
  { name: 'Abridor de Lata', category: 'Cozinha', quantity: 1 },
  { name: 'Abridor / Saca-rolhas', category: 'Cozinha', quantity: 1 },
  { name: 'Tigela 600ml c/ Tampa', category: 'Cozinha', quantity: 1 },
  { name: 'Tigela 350ml c/ Tampa', category: 'Cozinha', quantity: 1 },
  { name: 'Lixeira Cozinha (Tramontina)', category: 'Cozinha', quantity: 1 },
  { name: 'Escorredor de Massa', category: 'Cozinha', quantity: 1 },
  { name: 'Tábua de Vidro', category: 'Cozinha', quantity: 1 },
  { name: 'Escorredor de Louça', category: 'Cozinha', quantity: 1 },
  { name: 'Porta Detergente', category: 'Cozinha', quantity: 1 },
  { name: 'Jogo Americano', category: 'Cozinha', quantity: 4 },
  { name: 'Organizador de Talheres', category: 'Cozinha', quantity: 1 },
  { name: 'Filtro de Água', category: 'Cozinha', quantity: 1 },

  // Quarto
  { name: 'Cama Box Queen', category: 'Quarto', quantity: 1 },
  { name: 'Colchão Hoteleiro', category: 'Quarto', quantity: 1 },
  { name: 'Travesseiro Oasis 50x70', category: 'Quarto', quantity: 4 },
  { name: 'Protetor de Travesseiro Impermeável', category: 'Quarto', quantity: 4 },
  { name: 'Protetor de Colchão Impermeável', category: 'Quarto', quantity: 1 },
  { name: 'Lençol Queen 180 fios (branco)', category: 'Quarto', quantity: 9 },
  { name: 'Fronha 50x70', category: 'Quarto', quantity: 16 },
  { name: 'Edredom Imperial Plus Queen', category: 'Quarto', quantity: 1 },
  { name: 'Manta Microfibra 220x250', category: 'Quarto', quantity: 1 },
  { name: 'Saia Box Queen', category: 'Quarto', quantity: 1 },
  { name: 'Blackout', category: 'Quarto', quantity: 1 },
  { name: 'Ar-condicionado', category: 'Quarto', quantity: 1 },

  // Sala
  { name: 'Sofá Pequeno ou Poltrona', category: 'Sala', quantity: 1 },
  { name: 'Smart TV 43"+', category: 'Sala', quantity: 1 },
  { name: 'Antena Digital Amplificada', category: 'Sala', quantity: 1 },
  { name: 'Tapete', category: 'Sala', quantity: 1 },

  // Banheiro
  { name: 'Toalha de Banho Toronto 75x150', category: 'Banheiro', quantity: 7 },
  { name: 'Toalha de Rosto Toronto 48x85', category: 'Banheiro', quantity: 7 },
  { name: 'Toalha de Piso Toronto 48x80', category: 'Banheiro', quantity: 4 },
  { name: 'Secador de Cabelo de Parede', category: 'Banheiro', quantity: 1 },
  { name: 'Lixeira Inox Banheiro', category: 'Banheiro', quantity: 1 },
  { name: 'Porta Amenities Acrílico', category: 'Banheiro', quantity: 1 },

  // Diversos
  { name: 'Fechadura Digital + Gateway', category: 'Diversos', quantity: 1 },
  { name: 'Vaporizador', category: 'Diversos', quantity: 1 },
  { name: 'Vassoura', category: 'Diversos', quantity: 1 },
  { name: 'Rodo', category: 'Diversos', quantity: 1 },
  { name: 'Pá', category: 'Diversos', quantity: 1 },
  { name: 'Cabide Antifurto Madeira', category: 'Diversos', quantity: 6 },
  { name: 'Adaptador c/ USB para Gateway', category: 'Diversos', quantity: 1 },
  { name: 'Display de Mesa', category: 'Diversos', quantity: 1 },

  // Decoração
  { name: 'Quadros A2', category: 'Decoração', quantity: 2 },
  { name: 'Almofada Baguete Charlie', category: 'Decoração', quantity: 1 },
  { name: 'Capacho', category: 'Decoração', quantity: 1 },
  { name: 'Vasos Diversos', category: 'Decoração', quantity: 3 },
  { name: 'Plantas Artificiais', category: 'Decoração', quantity: 3 },
  { name: 'Adornos Decorativos', category: 'Decoração', quantity: 3 },
  { name: 'Almofadas Decorativas + Enchimento', category: 'Decoração', quantity: 2 },
  { name: 'Livros Decorativos', category: 'Decoração', quantity: 3 },
];

export function useSeedData(items: Item[], isLoading: boolean) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const seeded = useRef(false);

  useEffect(() => {
    if (isLoading || !user || seeded.current || items.length > 0) return;
    seeded.current = true;

    const seed = async () => {
      const rows = SEED_ITEMS.map(item => ({
        ...item,
        user_id: user.id,
        status: 'Pendente' as const,
      }));

      const { error } = await supabase.from('items').insert(rows);
      if (!error) {
        queryClient.invalidateQueries({ queryKey: ['items'] });
      }
    };

    seed();
  }, [isLoading, user, items.length, queryClient]);
}
