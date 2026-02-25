import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NavLink } from '@/components/NavLink';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
    UserPlus, Building2, Microscope, Link, BookOpen, FileText,
    BarChart3, Users, Globe, LogOut, User, Menu
} from 'lucide-react';

const operatorLinks = [
    { title: 'Add Researcher', url: '/add-researcher', icon: UserPlus },
    { title: 'Add Office', url: '/add-office', icon: Building2 },
    { title: 'Add Lab Equipment', url: '/add-equipment', icon: Microscope },
    { title: 'Assign Equipment', url: '/assign-equipment', icon: Link },
    { title: 'Add Journal Issue', url: '/add-journal', icon: BookOpen },
];

const reportLinks = [
    { title: 'Office Occupancy', url: '/report-occupancy', icon: Building2 },
    { title: 'Editor Workload', url: '/report-editors', icon: Users },
    { title: 'Digital Publishing', url: '/report-digital', icon: Globe },
];

export const AppLayout = ({ children }: { children: ReactNode }) => {
    const { user, logout } = useAuth();

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <Sidebar className="w-64" collapsible="icon">
                    <div className="p-4 border-b border-sidebar-border">
                        <h2 className="text-lg font-bold font-heading text-sidebar-foreground">
                            Research Institute
                        </h2>
                        <p className="text-xs text-sidebar-foreground/60 mt-1 capitalize">
                            {user?.role} · {user?.name}
                        </p>
                    </div>
                    <SidebarContent>
                        {user?.role === 'researcher' ? (
                            <SidebarGroup>
                                <SidebarGroupLabel className="text-sidebar-foreground/50">My Dashboard</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <NavLink to="/researcher-dashboard" end activeClassName="bg-sidebar-accent text-sidebar-primary">
                                                    <User className="mr-2 h-4 w-4" />
                                                    <span>My Details</span>
                                                </NavLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ) : (
                            <>
                                <SidebarGroup>
                                    <SidebarGroupLabel className="text-sidebar-foreground/50">Data Entry</SidebarGroupLabel>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {operatorLinks.map((item) => (
                                                <SidebarMenuItem key={item.url}>
                                                    <SidebarMenuButton asChild>
                                                        <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-primary">
                                                            <item.icon className="mr-2 h-4 w-4" />
                                                            <span>{item.title}</span>
                                                        </NavLink>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                                {user?.role === 'admin' && (
                                    <SidebarGroup>
                                        <SidebarGroupLabel className="text-sidebar-foreground/50">Reports</SidebarGroupLabel>
                                        <SidebarGroupContent>
                                            <SidebarMenu>
                                                {reportLinks.map((item) => (
                                                    <SidebarMenuItem key={item.url}>
                                                        <SidebarMenuButton asChild>
                                                            <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-primary">
                                                                <item.icon className="mr-2 h-4 w-4" />
                                                                <span>{item.title}</span>
                                                            </NavLink>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                ))}
                                            </SidebarMenu>
                                        </SidebarGroupContent>
                                    </SidebarGroup>
                                )}
                            </>
                        )}
                    </SidebarContent>
                    <div className="p-4 border-t border-sidebar-border mt-auto">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                            onClick={logout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </Sidebar>

                <div className="flex-1 flex flex-col min-h-screen">
                    <header className="h-14 flex items-center border-b bg-card px-4 gap-3">
                        <SidebarTrigger>
                            <Menu className="h-5 w-5" />
                        </SidebarTrigger>
                        <span className="text-sm text-muted-foreground font-body">
                            Central Research Institute Publication System
                        </span>
                    </header>
                    <main className="flex-1 p-6 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};
