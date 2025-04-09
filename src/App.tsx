
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Polls from "./pages/Polls";
import PollDetail from "./pages/PollDetail";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePolls from "./pages/admin/ManagePolls";
import CreateEditPoll from "./pages/admin/CreateEditPoll";
import ManageCandidates from "./pages/admin/ManageCandidates";
import CreateEditCandidate from "./pages/admin/CreateEditCandidate";
import ManageVotes from "./pages/admin/ManageVotes";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="/polls/:pollId" element={<PollDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/polls" element={<ManagePolls />} />
            <Route path="/admin/polls/:pollId" element={<CreateEditPoll />} />
            <Route path="/admin/candidates" element={<ManageCandidates />} />
            <Route path="/admin/candidates/:candidateId" element={<CreateEditCandidate />} />
            <Route path="/admin/votes" element={<ManageVotes />} />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
