import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/index";
import { Toaster } from "./components/ui/sonner";
import Studio from "./pages/studio";
import Layout from "./components/layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/studio" element={<Studio />} />
        </Route>
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
