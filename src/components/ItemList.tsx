import { useState } from 'react';
import { Item, Quotation, ItemStatus, CATEGORIES, CATEGORY_ICONS } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import QuotationModal from './QuotationModal';
import EditItemModal from './EditItemModal';

interface ItemListProps {
  items: Item[];
  quotations: Quotation[];
  onUpdateStatus: (id: string, status: ItemStatus) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (data: { id: string; name?: string; category?: string; quantity?: number }) => void;
  onAddQuotation: (q: { item_id: string; store_name: string; price: number; link?: string }) => void;
  onDeleteQuotation: (id: string) => void;
}

function StatusBadge({ status }: { status: ItemStatus }) {
  const cls = status === 'Comprado' ? 'status-badge-comprado' : status === 'Em Análise' ? 'status-badge-analise' : 'status-badge-pendente';
  return <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border-0 ${cls}`}>{status}</Badge>;
}

export default function ItemList({ items, quotations, onUpdateStatus, onDeleteItem, onUpdateItem, onAddQuotation, onDeleteQuotation }: ItemListProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catItems = items.filter(i => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {} as Record<string, Item[]>);

  // Also add any categories not in CATEGORIES
  items.forEach(item => {
    if (!CATEGORIES.includes(item.category as any)) {
      if (!grouped[item.category]) grouped[item.category] = [];
      if (!grouped[item.category].find(i => i.id === item.id)) {
        grouped[item.category].push(item);
      }
    }
  });

  return (
    <>
      <Accordion type="multiple" defaultValue={Object.keys(grouped)} className="space-y-2">
        {Object.entries(grouped).map(([category, catItems]) => {
          const boughtCount = catItems.filter(i => i.status === 'Comprado').length;
          const icon = CATEGORY_ICONS[category] || '📋';

          return (
            <AccordionItem key={category} value={category} className="border rounded-lg bg-card overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <span className="text-lg">{icon}</span>
                  <span className="font-heading font-semibold text-sm">{category}</span>
                  <Badge variant="secondary" className="text-[10px] ml-1">
                    {boughtCount}/{catItems.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <div className="divide-y divide-border">
                  {catItems.map(item => {
                    const itemQuotations = quotations.filter(q => q.item_id === item.id);
                    const cheapest = itemQuotations.length > 0
                      ? Math.min(...itemQuotations.map(q => Number(q.price)))
                      : null;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={item.status === 'Comprado'}
                          onCheckedChange={(checked) => {
                            onUpdateStatus(item.id, checked ? 'Comprado' : 'Pendente');
                          }}
                          className="shrink-0"
                        />
                        <button
                          className="flex-1 text-left min-w-0"
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium truncate ${item.status === 'Comprado' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {item.name}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[10px] text-muted-foreground shrink-0">×{item.quantity}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StatusBadge status={item.status} />
                            {cheapest !== null && (
                              <span className="text-[10px] text-success font-medium">
                                {cheapest.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            )}
                            {itemQuotations.length > 0 && (
                              <span className="text-[10px] text-muted-foreground">
                                ({itemQuotations.length} cotaç{itemQuotations.length === 1 ? 'ão' : 'ões'})
                              </span>
                            )}
                          </div>
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedItem(item)}>
                              <ExternalLink className="h-3.5 w-3.5 mr-2" />Cotações
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(item.id, 'Em Análise')}>
                              Em Análise
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditItem(item)}>
                              <Pencil className="h-3.5 w-3.5 mr-2" />Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onDeleteItem(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {selectedItem && (
        <QuotationModal
          item={selectedItem}
          quotations={quotations.filter(q => q.item_id === selectedItem.id)}
          onClose={() => setSelectedItem(null)}
          onAddQuotation={onAddQuotation}
          onDeleteQuotation={onDeleteQuotation}
        />
      )}

      {editItem && (
        <EditItemModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={onUpdateItem}
        />
      )}
    </>
  );
}
