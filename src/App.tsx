import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalOverlays } from './components/ConnectModal';
import { HomePage } from './pages/HomePage';
import { StudioPage } from './pages/StudioPage';
import { GuiForgePage } from './pages/GuiForgePage';
import { ConnectPage } from './pages/ConnectPage';
import { ShowcasePage } from './pages/ShowcasePage';
import { PricingPage } from './pages/PricingPage';
import { DocsPage } from './pages/DocsPage';

const RouteView: React.FC = () => {
  const { route } = useStudio();
  switch (route) {
    case '/studio':
      return <StudioPage />;
    case '/gui':
      return <GuiForgePage />;
    case '/connect':
      return <ConnectPage />;
    case '/showcase':
      return <ShowcasePage />;
    case '/pricing':
      return <PricingPage />;
    case '/docs':
      return <DocsPage />;
    default:
      return <HomePage />;
  }
};

export const App: React.FC = () => {
  return (
    <StudioProvider>
      <div className="min-h-screen flex flex-col bg-[#090B10] text-[#F3F6FC]">
        <Navbar />
        <main className="flex-1">
          <RouteView />
        </main>
        <Footer />
        <GlobalOverlays />
      </div>
    </StudioProvider>
  );
};
export default App;
