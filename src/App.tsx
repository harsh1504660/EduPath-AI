
//import { Toaster } from "@/components/ui/toaster";
import { Toaster } from 'sonner';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Footer from "./components/Footer";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Roadmap from "./pages/Roadmap";
import Chatbot from "./pages/Chatbot";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import QuizPage from "./pages/QuizPage";
import QnaPage from "./pages/QnaPage";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster
  richColors
  theme="light"
  closeButton
  toastOptions={{
    className: 'rounded-xl shadow-lg border border-purple-300 bg-white text-sm text-purple-900',
    descriptionClassName: 'text-gray-500',
  }}
/>
      
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/quiz" element={<QuizPage />} />
           
              <Route path="/qna" element={<QnaPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
