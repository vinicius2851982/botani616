import { useState } from 'react';
import { CATEGORIES } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: { name: string; category: string; quantity: number }) => void;
}

export default function AddItemModal({ open, onClose, onAdd }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Cozinha');
  const [quantity, setQuantity] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), category, quantity: parseInt(quantity) || 1 });
    setName('');
    setQuantity('1');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="font-heading">Novo Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Nome do item</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Micro-ondas"
              required
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Quantidade</Label>
            <Input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Adicionar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
