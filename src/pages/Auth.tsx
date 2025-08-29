import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Building2, Users } from 'lucide-react';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password, { username, role });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/10 dark:bg-background/20"></div>
      
      <Card className="w-full max-w-md glass-card border-border/20 relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-foreground">
            {isLogin ? 'Entrar no Sistema' : 'Criar Conta'}
          </CardTitle>
          
          <CardDescription className="text-muted-foreground">
            Sistema de Gestão de Manutenção Predial - PRF
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">Nome de Usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={!isLogin}
                    className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                    placeholder="Seu nome de usuário"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-foreground">Tipo de Usuário</Label>
                  <Select value={role} onValueChange={setRole} required={!isLogin}>
                    <SelectTrigger className="bg-background/50 border-border/50 text-foreground">
                      <SelectValue placeholder="Selecione o tipo de usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Administrador
                        </div>
                      </SelectItem>
                      <SelectItem value="gestor_prf">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Gestor PRF
                        </div>
                      </SelectItem>
                      <SelectItem value="servidor_prf">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Servidor PRF
                        </div>
                      </SelectItem>
                      <SelectItem value="empresa">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Empresa Terceirizada
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                placeholder="Sua senha"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full btn-modern font-semibold hover-lift"
              disabled={loading}
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent/10"
              >
                {isLogin ? 'Não tem uma conta? Criar conta' : 'Já tem uma conta? Fazer login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Auth;