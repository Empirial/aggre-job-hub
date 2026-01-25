import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Bursaries from "./pages/Bursaries";
import StemCareers from "./pages/StemCareers";
import SassaUpdates from "./pages/SassaUpdates";
import Universities from "./pages/Universities";
import Nsfas from "./pages/Nsfas";
import Donate from "./pages/Donate";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/CookiePolicy";
import Resources from "./pages/Resources";
import SAJobMarketGuide2026 from "./pages/resources/SAJobMarketGuide2026";
import NsfasApplicationMistakes from "./pages/resources/NsfasApplicationMistakes";
import JohannesburgCVTips from "./pages/resources/JohannesburgCVTips";
import SassaSrdGuide from "./pages/resources/SassaSrdGuide";
import WesternCapeStemBursaries from "./pages/resources/WesternCapeStemBursaries";
import NotFound from "./pages/NotFound";
import { CookieConsent } from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/bursaries" element={<Bursaries />} />
          <Route path="/stem-careers" element={<StemCareers />} />
          <Route path="/sassa-updates" element={<SassaUpdates />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/nsfas" element={<Nsfas />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/sa-job-market-guide-2026" element={<SAJobMarketGuide2026 />} />
          <Route path="/resources/nsfas-application-mistakes" element={<NsfasApplicationMistakes />} />
          <Route path="/resources/johannesburg-cv-tips" element={<JohannesburgCVTips />} />
          <Route path="/resources/sassa-srd-guide" element={<SassaSrdGuide />} />
          <Route path="/resources/western-cape-stem-bursaries" element={<WesternCapeStemBursaries />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
