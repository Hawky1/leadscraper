import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LeadGeneration from "./pages/LeadGeneration";
import Roadmap from "./pages/Roadmap";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route element={<AuthenticatedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lead-gen" element={<LeadGeneration />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/prompt-builder" element={<ComingSoon />} />
              <Route path="/objection-handling" element={<ComingSoon />} />
              <Route path="/gpts" element={<ComingSoon />} />
              <Route path="/voice-agent" element={<ComingSoon />} />
              <Route path="/sora" element={<ComingSoon />} />
              <Route path="/app-builder" element={<ComingSoon />} />
              <Route path="/help" element={<ComingSoon />} />
              <Route path="/settings" element={<ComingSoon />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
