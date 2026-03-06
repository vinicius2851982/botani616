import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useItems } from '@/hooks/useItems';
import Dashboard from '@/components/Dashboard';
import ItemList from '@/components/ItemList';
import AddItemModal from '@/components/AddItemModal';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, LogOut, Plus, Loader2 } from 'lucide-react';
import { useSeedData } from '@/hooks/useSeedData';

export default function Index() {
  const { user, signOut } = useAuth();
  const { items, quotations, isLoading, updateStatus, addItem, updateItem, deleteItem, addQuotation, deleteQuotation } = useItems();
  const [showAddItem, setShowAddItem] = useState(false);

  useSeedData(items, isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ClipboardCheck className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-heading font-bold leading-tight">Checklist Investidor</h1>
              <p className="text-[10px] text-muted-foreground">Padrão Charlie · 31m²</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container py-4 space-y-6">
        <Dashboard items={items} quotations={quotations} />

        <div className="flex items-center justify-between">
          <h2 className="text-base font-heading font-bold">Itens</h2>
          <Button size="sm" onClick={() => setShowAddItem(true)} className="gap-1.5 h-8">
            <Plus className="h-3.5 w-3.5" />
            Novo item
          </Button>
        </div>

        <ItemList
          items={items}
          quotations={quotations}
          onUpdateStatus={(id, status) => updateStatus.mutate({ id, status })}
          onDeleteItem={(id) => deleteItem.mutate(id)}
          onUpdateItem={(data) => updateItem.mutate(data)}
          onAddQuotation={(q) => addQuotation.mutate(q)}
          onDeleteQuotation={(id) => deleteQuotation.mutate(id)}
        />
      </main>

      <AddItemModal
        open={showAddItem}
        onClose={() => setShowAddItem(false)}
        onAdd={(item) => addItem.mutate(item)}
      />
    </div>
  );
}
