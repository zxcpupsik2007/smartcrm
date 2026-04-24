'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, CheckSquare, TrendingUp, LogOut } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState({ clients: 0, deals: 0, tasks: 0 });
    const [deals, setDeals] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setUser(auth.getUser());
    }, []);

    useEffect(() => {
        if (!auth.isAuthenticated()) { window.location.href = '/login'; return; }
        loadData();
    }, []);

    const loadData = async () => {
        const [clients, deals, tasks] = await Promise.all([
            api.get('/clients'),
            api.get('/deals'),
            api.get('/tasks'),
        ]);
        setStats({ clients: clients.length, deals: deals.length, tasks: tasks.length });
        setDeals(deals.slice(0, 5));
    };

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">SmartCRM</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{user?.name}</span>
                    <Button variant="ghost" size="sm" onClick={auth.logout}>
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </nav>
            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="cursor-pointer hover:border-primary transition" onClick={() => window.location.href = '/clients'}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Clients</CardTitle>
                            <Users className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><p className="text-3xl font-bold">{stats.clients}</p></CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:border-primary transition" onClick={() => window.location.href = '/deals'}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Deals</CardTitle>
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><p className="text-3xl font-bold">{stats.deals}</p></CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:border-primary transition" onClick={() => window.location.href = '/tasks'}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks</CardTitle>
                            <CheckSquare className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><p className="text-3xl font-bold">{stats.tasks}</p></CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" /> Recent Deals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {deals.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No deals yet</p>
                        ) : (
                            <div className="space-y-3">
                                {deals.map(deal => (
                                    <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div>
                                            <p className="font-medium">{deal.title}</p>
                                            <p className="text-sm text-muted-foreground">{deal.client?.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">${deal.amount}</p>
                                            <p className="text-sm text-muted-foreground">AI Score: {deal.aiScore}/10</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}