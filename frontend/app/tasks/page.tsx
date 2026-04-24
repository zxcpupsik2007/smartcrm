'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', clientId: '', dueDate: '' });

  useEffect(() => {
    if (!auth.isAuthenticated()) { window.location.href = '/login'; return; }
    loadData();
  }, []);

  const loadData = async () => {
    const [t, c] = await Promise.all([api.get('/tasks'), api.get('/clients')]);
    setTasks(t);
    setClients(c);
  };

  const handleCreate = async () => {
    await api.post('/tasks', { ...form, client: form.clientId ? { id: parseInt(form.clientId) } : null });
    setOpen(false);
    setForm({ title: '', description: '', clientId: '', dueDate: '' });
    loadData();
  };

  const toggleComplete = async (task: any) => {
    await api.put(`/tasks/${task.id}`, { completed: !task.completed });
    loadData();
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => window.location.href='/dashboard'}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold">Tasks</h1>
      </nav>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">{tasks.filter(t => !t.completed).length} pending tasks</p>
          <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Task</Button>
        </div>
        <div className="grid gap-3">
          {tasks.map(task => (
            <Card key={task.id} className={task.completed ? 'opacity-50' : ''}>
              <CardContent className="p-4 flex items-center gap-3">
                <button onClick={() => toggleComplete(task)}>
                  {task.completed
                    ? <CheckCircle2 className="w-5 h-5 text-primary" />
                    : <Circle className="w-5 h-5 text-muted-foreground" />}
                </button>
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                  {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                  {task.client && <p className="text-xs text-muted-foreground mt-1">Client: {task.client.name}</p>}
                </div>
                {task.dueDate && (
                  <p className="text-xs text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Task</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="space-y-1">
              <Label>Client (optional)</Label>
              <select className="w-full border rounded-md p-2 bg-background text-sm" value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}>
                <option value="">No client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Due Date</Label>
              <Input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
            </div>
            <Button className="w-full" onClick={handleCreate}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}