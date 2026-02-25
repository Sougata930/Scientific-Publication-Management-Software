import { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BookOpen, Shield, Keyboard, FlaskConical } from 'lucide-react';

const roleConfig: Record<UserRole, { label: string; icon: typeof Shield; description: string }> = {
    admin: { label: 'Administrator', icon: Shield, description: 'Full access including reports' },
    operator: { label: 'Data Entry Operator', icon: Keyboard, description: 'Manage researchers, equipment & publications' },
    researcher: { label: 'Researcher', icon: FlaskConical, description: 'View your papers & journal contributions' },
};

const Login = () => {
    const { login, users } = useAuth();
    const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
    const [selectedUser, setSelectedUser] = useState('');

    const filteredUsers = users.filter(u => u.role === selectedRole);

    const handleLogin = () => {
        if (selectedUser) login(selectedUser);
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
                        <BookOpen className="w-8 h-8 text-secondary" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-primary-foreground">
                        Research Institute
                    </h1>
                    <p className="text-primary-foreground/70 mt-2 font-body">
                        Publication Management System
                    </p>
                </div>

                <Card className="border-0" style={{ boxShadow: 'var(--shadow-elevated)' }}>
                    <CardHeader>
                        <CardTitle className="font-heading">Sign In</CardTitle>
                        <CardDescription>Select your role and account to continue</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={selectedRole} onValueChange={(v) => { setSelectedRole(v as UserRole); setSelectedUser(''); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(Object.keys(roleConfig) as UserRole[]).map(role => {
                                        const cfg = roleConfig[role];
                                        return (
                                            <SelectItem key={role} value={role}>
                                                <div className="flex items-center gap-2">
                                                    <cfg.icon className="h-4 w-4 text-muted-foreground" />
                                                    <span>{cfg.label}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            {selectedRole && (
                                <p className="text-xs text-muted-foreground">{roleConfig[selectedRole].description}</p>
                            )}
                        </div>

                        {selectedRole && (
                            <div className="space-y-2">
                                <Label>User</Label>
                                <Select value={selectedUser} onValueChange={setSelectedUser}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredUsers.map(u => (
                                            <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <Button className="w-full" disabled={!selectedUser} onClick={handleLogin}>
                            Sign In
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
