import { useTheme } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { Home } from '@/pages/Home';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="app-root">
      <Header />
      <main>
        <Home />
      </main>
      <Toaster theme={theme} richColors position="top-right" />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
