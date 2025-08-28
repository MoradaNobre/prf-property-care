import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Properties from "@/pages/Properties";
import Maintenance from "@/pages/Maintenance";
import Companies from "@/pages/Companies";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="properties" element={<Properties />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="companies" element={<Companies />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
