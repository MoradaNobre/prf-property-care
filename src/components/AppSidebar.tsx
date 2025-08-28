import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Wrench, 
  Users, 
  Settings,
  Shield,
  FileText
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navigation = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Imóveis',
    url: '/properties',
    icon: Building2,
  },
  {
    title: 'Manutenções',
    url: '/maintenance',
    icon: Wrench,
  },
  {
    title: 'Empresas',
    url: '/companies',
    icon: Users,
  },
  {
    title: 'Relatórios',
    url: '/reports',
    icon: FileText,
  },
];

const adminNavigation = [
  {
    title: 'Usuários',
    url: '/users',
    icon: Shield,
  },
  {
    title: 'Configurações',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    const baseClasses = "w-full justify-start transition-all duration-200";
    if (isActive(path)) {
      return `${baseClasses} bg-secondary/20 text-secondary border-r-2 border-secondary`;
    }
    return `${baseClasses} text-white/80 hover:text-white hover:bg-white/10`;
  };

  return (
    <Sidebar className={`${collapsed ? 'w-14' : 'w-64'} glass-nav border-r border-white/10`}>
      <SidebarContent className="p-0">
        {/* Logo Section */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-white font-bold text-lg">PRF</h1>
                <p className="text-white/60 text-xs">Gestão Predial</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider px-4 py-2">
              Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClassName(item.url)}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider px-4 py-2">
              Administração
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {adminNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClassName(item.url)}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}