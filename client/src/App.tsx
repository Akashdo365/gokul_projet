import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import ObjectDetection from "@/pages/ObjectDetection";
import TextReading from "@/pages/TextReading";
import CurrencyDetection from "@/pages/CurrencyDetection";
import Emergency from "@/pages/Emergency";
import Profile from "@/pages/Profile";
import History from "@/pages/History";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/object-detection" component={ObjectDetection} />
      <Route path="/text-reading" component={TextReading} />
      <Route path="/currency" component={CurrencyDetection} />
      <Route path="/emergency" component={Emergency} />
      <Route path="/profile" component={Profile} />
      <Route path="/history" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
