import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import {
  Rss,
  Layers,
  HelpCircle,
  Link2,
  Youtube,
  Sparkles,
  Bell,
  MessageSquare
} from 'lucide-react';
import { db } from '../lib/firebase';
import { formatDateTime } from '../lib/time';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import OnlineUsersPanel from '../components/OnlineUsersPanel';

const RecentCard = ({ title, items, loading, emptyLabel }) => (
  <Card className="rounded-[2px]">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gradient">{title}</h3>
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Latest</span>
    </div>
    <div className="mt-3 space-y-2">
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-6 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs text-white/50">{emptyLabel}</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 rounded-[2px] border border-white/5 bg-white/5 px-3 py-2 text-xs"
          >
            <span className="text-white/80">{item.title}</span>
            <span className="text-white/40">{formatDateTime(item.createdAt)}</span>
          </div>
        ))
      )}
    </div>
  </Card>
);

const QuickDock = ({ items, loading }) => (
  <Card className="rounded-[2px]">
    <div className="flex items-center justify-between">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Quick Dock</h3>
      {loading ? <Skeleton className="h-3 w-12" /> : <span className="text-[10px] text-white/40">Instant access</span>}
    </div>
    <div className="mt-4 grid grid-cols-4 gap-2">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          title={item.label}
          aria-label={item.label}
          className="flex flex-col items-center gap-2 rounded-[2px] border border-white/10 bg-black/40 px-2 py-3 transition hover:border-coral/40 hover:bg-white/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-white/10 bg-black/60">
            <item.icon size={18} className="text-coral" />
          </div>
        </Link>
      ))}
    </div>
  </Card>
);

const NavCard = ({ title, subtitle, icon: Icon, to }) => (
  <Link to={to} className="block">
    <Card className="rounded-[2px] transition hover:shadow-glow">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-white/10 bg-black/50">
          <Icon size={18} className="text-coral" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white/90">{title}</p>
          <p className="text-xs text-white/50">{subtitle}</p>
        </div>
      </div>
    </Card>
  </Link>
);

const DashboardPage = () => {
  const [counts, setCounts] = useState({
    feed: 0,
    projects: 0,
    questions: 0,
    links: 0,
    alerts: 0
  });
  const [countLoading, setCountLoading] = useState(true);

  const [recentFeed, setRecentFeed] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isIosInstallHint, setIsIosInstallHint] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const syncInstallPrompt = () => {
      setInstallPrompt(window.__pwaInstallPrompt || null);
    };

    syncInstallPrompt();
    window.addEventListener('pwa-install-available', syncInstallPrompt);

    const detectInstallState = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      setIsInstalled(Boolean(isStandalone));
      const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
      setIsIosInstallHint(isIos && !isStandalone);
    };

    detectInstallState();
    window.addEventListener('appinstalled', detectInstallState);

    return () => {
      window.removeEventListener('pwa-install-available', syncInstallPrompt);
      window.removeEventListener('appinstalled', detectInstallState);
    };
  }, []);

  useEffect(() => {
    const feedCountRef = collection(db, 'feedPosts');
    const projectCountRef = collection(db, 'projects');
    const questionCountRef = collection(db, 'questions');
    const linkCountRef = collection(db, 'links');
    const alertCountRef = collection(db, 'alerts');

    const unsubscribers = [];

    unsubscribers.push(
      onSnapshot(feedCountRef, (snap) => {
        setCounts((prev) => ({ ...prev, feed: snap.size }));
        setCountLoading(false);
      })
    );

    unsubscribers.push(
      onSnapshot(projectCountRef, (snap) => {
        setCounts((prev) => ({ ...prev, projects: snap.size }));
        setCountLoading(false);
      })
    );

    unsubscribers.push(
      onSnapshot(questionCountRef, (snap) => {
        setCounts((prev) => ({ ...prev, questions: snap.size }));
        setCountLoading(false);
      })
    );

    unsubscribers.push(
      onSnapshot(linkCountRef, (snap) => {
        setCounts((prev) => ({ ...prev, links: snap.size }));
        setCountLoading(false);
      })
    );

    unsubscribers.push(
      onSnapshot(alertCountRef, (snap) => {
        setCounts((prev) => ({ ...prev, alerts: snap.size }));
        setCountLoading(false);
      })
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  useEffect(() => {
    const feedQuery = query(collection(db, 'feedPosts'), orderBy('createdAt', 'desc'), limit(5));
    const projectQuery = query(collection(db, 'projects'), orderBy('updatedAt', 'desc'), limit(5));
    const questionQuery = query(collection(db, 'questions'), orderBy('updatedAt', 'desc'), limit(5));
    const alertQuery = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'), limit(5));

    const unsubscribers = [];

    unsubscribers.push(
      onSnapshot(feedQuery, (snap) => {
        setRecentFeed(
          snap.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().text?.slice(0, 40) || 'New post',
            createdAt: doc.data().createdAt
          }))
        );
        setRecentLoading(false);
      })
    );

    unsubscribers.push(
      onSnapshot(projectQuery, (snap) => {
        setRecentProjects(
          snap.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            createdAt: doc.data().updatedAt || doc.data().createdAt
          }))
        );
        setRecentLoading(false);
      })
    );

    unsubscribers.push(
      onSnapshot(questionQuery, (snap) => {
        setRecentQuestions(
          snap.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            createdAt: doc.data().updatedAt || doc.data().createdAt
          }))
        );
        setRecentLoading(false);
      })
    );

    unsubscribers.push(
      onSnapshot(alertQuery, (snap) => {
        setRecentAlerts(
          snap.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().message?.slice(0, 40) || 'Alert',
            createdAt: doc.data().createdAt
          }))
        );
        setRecentLoading(false);
      })
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = installPrompt || window.__pwaInstallPrompt;
    if (!promptEvent) return;
    promptEvent.prompt();
    const result = await promptEvent.userChoice;
    if (result?.outcome === 'accepted') {
      setInstallPrompt(null);
      window.__pwaInstallPrompt = null;
    }
  };

  return (
    <div className="space-y-6">
      {!isInstalled && (
        <div className="flex flex-col items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleInstallClick}
            disabled={!installPrompt && !isIosInstallHint}
            className="rounded-[2px] px-4"
          >
            Install app
          </Button>
          {isIosInstallHint && (
            <span className="mt-1 text-[10px] text-white/40">iOS: Share → Add to Home Screen</span>
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card className="relative overflow-hidden rounded-[2px] px-6 py-8">
          <div className="pointer-events-none absolute right-6 top-1/2 h-48 w-48 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-coral/40 to-neonpink/40 blur-2xl" />
            <div className="absolute inset-4 animate-[spin_18s_linear_infinite] rounded-full border border-white/20" />
            <div className="absolute inset-10 animate-[spin_28s_linear_infinite] rounded-full border border-white/10" />
            <div className="absolute inset-16 rounded-full bg-white/10 blur-sm" />
          </div>
          <div className="relative max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Department pulse</span>
            <h2 className="mt-3 text-3xl font-semibold text-gradient">Welcome back</h2>
            <p className="mt-2 text-sm text-white/60">
              A quick pulse on the CS&E department. Jump into the latest updates or start a new
              thread.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button as="a" href="/feed">
                View feed
              </Button>
              <Button as="a" href="/messages" variant="outline">
                Open chat
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Rss size={14} className="text-coral" />
                {countLoading ? '—' : `${counts.feed} posts`}
              </span>
              <span className="flex items-center gap-1">
                <Layers size={14} className="text-coral" />
                {countLoading ? '—' : `${counts.projects} projects`}
              </span>
              <span className="flex items-center gap-1">
                <HelpCircle size={14} className="text-coral" />
                {countLoading ? '—' : `${counts.questions} questions`}
              </span>
              <span className="flex items-center gap-1">
                <Link2 size={14} className="text-coral" />
                {countLoading ? '—' : `${counts.links} links`}
              </span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <QuickDock
            loading={countLoading}
            items={[
              { label: 'Feed', icon: Rss, to: '/feed' },
              { label: 'Projects', icon: Layers, to: '/projects' },
              { label: 'Questions', icon: HelpCircle, to: '/qa' },
              { label: 'Links', icon: Link2, to: '/links' }
            ]}
          />
          <OnlineUsersPanel />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentCard
          title="Recent feed activity"
          items={recentFeed}
          loading={recentLoading}
          emptyLabel="No posts yet."
        />
        <RecentCard
          title="Recent projects"
          items={recentProjects}
          loading={recentLoading}
          emptyLabel="No projects yet."
        />
        <RecentCard
          title="Recent questions"
          items={recentQuestions}
          loading={recentLoading}
          emptyLabel="No questions yet."
        />
        <RecentCard
          title="Recent alerts"
          items={recentAlerts}
          loading={recentLoading}
          emptyLabel="No alerts yet."
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gradient">Quick navigation</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <NavCard title="Department feed" subtitle="Share the latest updates" icon={Rss} to="/feed" />
          <NavCard title="Projects board" subtitle="Track side work and demos" icon={Layers} to="/projects" />
          <NavCard title="Group chat" subtitle="Jump into live channels" icon={MessageSquare} to="/messages" />
          <NavCard title="Q&A" subtitle="Get answers fast" icon={HelpCircle} to="/qa" />
          <NavCard title="Saved links" subtitle="Curate articles and videos" icon={Link2} to="/links" />
          <NavCard title="Tubes" subtitle="Share YouTube videos" icon={Youtube} to="/tubes" />
          <NavCard title="Moments of ZEN" subtitle="Share calm and gratitude" icon={Sparkles} to="/zen" />
          <NavCard title="Broadcast alert" subtitle="Send an all-hands ping" icon={Bell} to="/alerts" />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
