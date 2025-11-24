import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/index";
import { Toaster } from "./components/ui/sonner";
import Studio from "./pages/studio";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/studio/:room_id" element={<Studio />} />
      </Routes>
    </BrowserRouter>
    <Toaster
      richColors={true}
      position="bottom-right"
      duration={1500}
      closeButton
    />
  </QueryClientProvider>
);

export default App;
