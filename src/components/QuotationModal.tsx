import { useState } from 'react';
import { Item, Quotation } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Plus, Search, Trash2 } from 'lucide-react';

interface QuotationModalProps {
  item: Item;
  quotations: Quotation[];
  onClose: () => void;
  onAddQuotation: (q: { item_id: string; store_name: string; price: number; link?: string }) => void;
  onDeleteQuotation: (id: string) => void;
}

export default function QuotationModal({ item, quotations, onClose, onAddQuotation, onDeleteQuotation }: QuotationModalProps) {
  const [storeName, setStoreName] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [showForm, setShowForm] = useState(false);

  const cheapestPrice = quotations.length > 0 ? Math.min(...quotations.map(q => Number(q.price))) : null;

  const handleSearch = () => {
    const query = encodeURIComponent(item.name);
    window.open(`https://www.google.com/search?tbm=shop&q=${query}`, '_blank');
  };

  const handleAdd = () => {
    if (!storeName.trim() || !price) return;
    onAddQuotation({
      item_id: item.id,
      store_name: storeName.trim(),
      price: parseFloat(price),
      link: link.trim() || undefined,
    });
    setStoreName('');
    setPrice('');
    setLink('');
    setShowForm(false);
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">{item.name}</DialogTitle>
          <p className="text-xs text-muted-foreground">
            {item.category} · Qtd: {item.quantity}
          </p>
        </DialogHeader>

        <Button variant="outline" onClick={handleSearch} className="w-full gap-2">
          <Search className="h-4 w-4" />
          Buscar na Internet
        </Button>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Cotações ({quotations.length}/5)
          </h4>

          {quotations.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma cotação ainda
            </p>
          )}

          {quotations
            .sort((a, b) => Number(a.price) - Number(b.price))
            .map(q => {
              const isCheapest = Number(q.price) === cheapestPrice;
              return (
                <div
                  key={q.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${isCheapest ? 'border-success/50 bg-success/5' : 'border-border'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{q.store_name}</span>
                      {isCheapest && (
                        <span className="text-[10px] bg-success text-success-foreground px-1.5 py-0.5 rounded-full font-medium">
                          Menor preço
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-bold ${isCheapest ? 'text-success' : 'text-foreground'}`}>
                      {Number(q.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {q.link && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <a href={q.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => onDeleteQuotation(q.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>

        {quotations.length < 5 && !showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Adicionar cotação
          </Button>
        )}

        {showForm && (
          <div className="space-y-3 p-3 rounded-lg border bg-muted/30">
            <div className="space-y-1.5">
              <Label className="text-xs">Loja</Label>
              <Input
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                placeholder="Nome da loja"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Preço (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Link (opcional)</Label>
              <Input
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} className="flex-1">Salvar</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
