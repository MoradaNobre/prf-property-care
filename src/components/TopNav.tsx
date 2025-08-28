import { Bell, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TopNav() {
  const { user, signOut } = useAuth();

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="h-16 glass-nav border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-white hover:bg-white/10" />
        <h2 className="text-white font-semibold">Sistema de Gestão de Manutenção Predial</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm"
          className="text-white/80 hover:text-white hover:bg-white/10 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full text-xs flex items-center justify-center text-accent-foreground">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-white/20 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block">{user?.email}</span>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Meu Perfil
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={signOut}
              className="flex items-center gap-2 text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}