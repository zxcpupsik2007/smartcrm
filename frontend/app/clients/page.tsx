'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Trash2 } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' });

  useEffect(() => {
    if (!auth.isAuthenticated()) { window.location.href = '/login'; return; }
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await api.get('/clients');
    setClients(data);
  };

  const handleCreate = async () => {
    await api.post('/clients', form);
    setOpen(false);
    setForm({ name: '', email: '', phone: '', company: '', notes: '' });
    loadClients();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/clients/${id}`);
    loadClients();
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => window.location.href='/dashboard'}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold">Clients</h1>
      </nav>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">{clients.length} clients total</p>
          <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Client</Button>
        </div>
        <div className="grid gap-4">
          {clients.map(client => (
            <Card key={client.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{client.name}</p>
                  <p className="text-sm text-muted-foreground">{client.company} · {client.email}</p>
                  {client.notes && <p className="text-sm text-muted-foreground mt-1">{client.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>{client.status}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(client.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Client</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {['name', 'email', 'phone', 'company', 'notes'].map(field => (
              <div key={field} className="space-y-1">
                <Label className="capitalize">{field}</Label>
                <Input value={(form as any)[field]} onChange={e => setForm({...form, [field]: e.target.value})} />
              </div>
            ))}
            <Button className="w-full" onClick={handleCreate}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}