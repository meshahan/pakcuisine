import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Reservations from "./pages/Reservations";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import Deals from "./pages/Deals";
import OrderSelection from "./pages/OrderSelection";

import { AIChatbot } from "@/components/chatbot/AIChatbot";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/context/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/order-selection" element={<OrderSelection />} />
                <Route path="/admin/*" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <AIChatbot />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
