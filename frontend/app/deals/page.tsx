'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Sparkles } from 'lucide-react';

const STAGES = ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];
const STAGE_COLORS: any = { new: 'secondary', contacted: 'default', proposal: 'default', negotiation: 'default', won: 'default', lost: 'destructive' };

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', stage: 'new', clientId: '' });

  useEffect(() => {
    if (!auth.isAuthenticated()) { window.location.href = '/login'; return; }
    loadData();
  }, []);

  const loadData = async () => {
    const [d, c] = await Promise.all([api.get('/deals'), api.get('/clients')]);
    setDeals(d);
    setClients(c);
  };

  const handleCreate = async () => {
    await api.post('/deals', { ...form, amount: parseFloat(form.amount), client: { id: parseInt(form.clientId) } });
    setOpen(false);
    setForm({ title: '', amount: '', stage: 'new', clientId: '' });
    loadData();
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => window.location.href='/dashboard'}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold">Deals</h1>
      </nav>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">{deals.length} deals total</p>
          <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Deal</Button>
        </div>
        <div className="grid gap-4">
          {deals.map(deal => (
            <Card key={deal.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{deal.title}</p>
                    <p className="text-sm text-muted-foreground">{deal.client?.name} · ${deal.amount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={STAGE_COLORS[deal.stage]}>{deal.stage}</Badge>
                    {deal.aiScore && <Badge variant="outline">AI: {deal.aiScore}/10</Badge>}
                  </div>
                </div>
                {deal.aiSuggestion && (
                  <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{deal.aiSuggestion}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Deal</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="space-y-1">
              <Label>Amount ($)</Label>
              <Input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
            </div>
            <div className="space-y-1">
              <Label>Client</Label>
              <select className="w-full border rounded-md p-2 bg-background text-sm" value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}>
                <option value="">Select client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Stage</Label>
              <select className="w-full border rounded-md p-2 bg-background text-sm" value={form.stage} onChange={e => setForm({...form, stage: e.target.value})}>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Button className="w-full" onClick={handleCreate}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}