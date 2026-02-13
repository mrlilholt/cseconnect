import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import FeedPage from './features/feed/pages/FeedPage';
import ProjectsPage from './features/projects/pages/ProjectsPage';
import QaPage from './features/qa/pages/QaPage';
import LinksPage from './features/links/pages/LinksPage';
import TubesPage from './features/tubes/pages/TubesPage';
import ChatPage from './features/chat/pages/ChatPage';
import AlertsPage from './features/alerts/pages/AlertsPage';
import ZenPage from './features/zen/pages/ZenPage';

const App = () => {
  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      window.__pwaInstallPrompt = event;
      window.dispatchEvent(new Event('pwa-install-available'));
    };

    const installedHandler = () => {
      window.__pwaInstallPrompt = null;
      window.dispatchEvent(new Event('pwa-install-available'));
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/qa" element={<QaPage />} />
            <Route path="/links" element={<LinksPage />} />
            <Route path="/tubes" element={<TubesPage />} />
            <Route path="/messages" element={<ChatPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/zen" element={<ZenPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
