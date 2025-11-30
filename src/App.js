import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChangeLayout from './components/layouts/ChangeLayout';
import DesktopPlaceholder from './components/layouts/Desktop';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import WinnersPage from './pages/WinnersPage';
import AboutPage from './pages/AboutPage';
import { ROUTES } from './config/constants';
import { BuxProvider } from './contexts/BuxContext';

function App() {
  return (
    <ErrorBoundary>
      <BuxProvider>
        <Router>
        <Routes>
          {/* homepage */}
          <Route
            path={ROUTES.HOME}
            element={
              <ChangeLayout desktopFallback={<DesktopPlaceholder />}>
                <Home />
              </ChangeLayout>
            }
          />

          {/* winners route */}
          <Route
            path={ROUTES.WINNERS}
            element={
              <ChangeLayout>
                <WinnersPage />
              </ChangeLayout>
            }
          />

          {/* about route */}
          <Route
            path={ROUTES.ABOUT}
            element={
              <ChangeLayout>
                <AboutPage />
              </ChangeLayout>
            }
          />

          {/* 404 redirect to home */}
          <Route
            path="*"
            element={
              <ChangeLayout desktopFallback={<DesktopPlaceholder />}>
                <Home />
              </ChangeLayout>
            }
          />
        </Routes>
        </Router>
      </BuxProvider>
    </ErrorBoundary>
  );
}

export default App;