import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const Overview = lazy(() => import("./pages/dashboard/Overview"));
const JobsBoard = lazy(() => import("./pages/dashboard/JobsBoard"));
const JobDetail = lazy(() => import("./pages/dashboard/JobDetail"));
const CVList = lazy(() => import("./pages/dashboard/CVList"));
const CVEditor = lazy(() => import("./pages/dashboard/CVEditor"));
const CVWorkspace = lazy(() => import("./pages/dashboard/CVWorkspace"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const Chat = lazy(() => import("./pages/dashboard/Chat"));
const Z83Form = lazy(() => import("./pages/dashboard/Z83Form"));
const Login = lazy(() => import("./pages/Login"));
const Landing = lazy(() => import("./pages/Landing"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<object>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<object>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              An unexpected error occurred. Please reload the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Overview />} />
                  <Route path="/jobs" element={<JobsBoard />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="/cv-editor" element={<CVList />} />
                  <Route path="/cv-editor/tailor" element={<CVEditor />} />
                  <Route path="/cv-editor/:id" element={<CVWorkspace />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/z83" element={<Z83Form />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
