export type ItemStatus = 'Pendente' | 'Em Análise' | 'Comprado';

export type Category = 'Cozinha' | 'Quarto' | 'Banheiro' | 'Sala' | 'Diversos' | 'Decoração';

export interface Item {
  id: string;
  user_id: string;
  name: string;
  category: string;
  quantity: number;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export interface Quotation {
  id: string;
  item_id: string;
  user_id: string;
  store_name: string;
  price: number;
  link: string | null;
  created_at: string;
}

export const CATEGORIES: Category[] = ['Cozinha', 'Quarto', 'Banheiro', 'Sala', 'Diversos', 'Decoração'];

export const CATEGORY_ICONS: Record<string, string> = {
  'Cozinha': '🍳',
  'Quarto': '🛏️',
  'Banheiro': '🚿',
  'Sala': '🛋️',
  'Diversos': '📦',
  'Decoração': '🎨',
};
