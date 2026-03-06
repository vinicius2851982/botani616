import { Item, Quotation } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock, ShoppingCart } from 'lucide-react';

interface DashboardProps {
  items: Item[];
  quotations: Quotation[];
}

export default function Dashboard({ items, quotations }: DashboardProps) {
  const total = items.length;
  const bought = items.filter(i => i.status === 'Comprado').length;
  const pending = items.filter(i => i.status === 'Pendente').length;
  const analyzing = items.filter(i => i.status === 'Em Análise').length;
  const progress = total > 0 ? Math.round((bought / total) * 100) : 0;

  // Total spent: sum of cheapest quotation per bought item
  const boughtItems = items.filter(i => i.status === 'Comprado');
  const totalSpent = boughtItems.reduce((acc, item) => {
    const itemQuotations = quotations.filter(q => q.item_id === item.id);
    if (itemQuotations.length > 0) {
      const cheapest = Math.min(...itemQuotations.map(q => Number(q.price)));
      return acc + cheapest * item.quantity;
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Progresso geral</span>
          <span className="font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-3" />
        <p className="text-xs text-muted-foreground text-right">
          {bought} de {total} itens comprados
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-bold text-foreground">{pending}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Pendentes</p>
        </Card>
        <Card className="p-3 text-center">
          <ShoppingCart className="h-4 w-4 mx-auto mb-1 text-warning" />
          <p className="text-lg font-bold text-foreground">{analyzing}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Em Análise</p>
        </Card>
        <Card className="p-3 text-center">
          <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-success" />
          <p className="text-lg font-bold text-foreground">{bought}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Comprados</p>
        </Card>
      </div>

      {totalSpent > 0 && (
        <Card className="p-3 bg-primary/5 border-primary/20">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Total investido</p>
          <p className="text-xl font-bold text-primary">
            {totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </Card>
      )}
    </div>
  );
}
