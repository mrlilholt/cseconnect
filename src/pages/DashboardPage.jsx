import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Skeleton,
  Button,
  IconButton
} from '@mui/material';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { Link as RouterLink } from 'react-router-dom';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LinkIcon from '@mui/icons-material/Link';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SpaIcon from '@mui/icons-material/Spa';
import CampaignIcon from '@mui/icons-material/Campaign';
import ChatIcon from '@mui/icons-material/Chat';
import { db } from '../lib/firebase';
import { formatDateTime } from '../lib/time';

const RecentCard = ({ title, items, loading, emptyLabel }) => (
  <Card sx={{ height: '100%', borderRadius: 2 }}>
    <CardContent>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>
      {loading ? (
        <Stack spacing={1}>
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} height={28} />
          ))}
        </Stack>
      ) : items.length === 0 ? (
        <Typography color="text.secondary">{emptyLabel}</Typography>
      ) : (
        <Stack spacing={1.5}>
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 173, 153, 0.12)'
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>{item.title}</Typography>
              <Typography color="text.secondary" variant="body2">
                {formatDateTime(item.createdAt)}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </CardContent>
  </Card>
);

const NavCard = ({ title, subtitle, icon, to }) => (
  <Card
    component={RouterLink}
    to={to}
    sx={{
      textDecoration: 'none',
      height: '100%',
      p: 2,
      borderRadius: 24,
      border: '1px solid rgba(255, 173, 153, 0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 18px 40px rgba(255, 125, 110, 0.18)'
      }
    }}
  >
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 125, 110, 0.18)',
        color: 'primary.main'
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  </Card>
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

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsIosInstallHint(isIos && !isStandalone);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
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
      onSnapshot(
        feedCountRef,
        (snap) => {
          setCounts((prev) => ({ ...prev, feed: snap.size }));
          setCountLoading(false);
        },
        () => setCountLoading(false)
      )
    );

    unsubscribers.push(
      onSnapshot(
        projectCountRef,
        (snap) => {
          setCounts((prev) => ({ ...prev, projects: snap.size }));
          setCountLoading(false);
        },
        () => setCountLoading(false)
      )
    );

    unsubscribers.push(
      onSnapshot(
        questionCountRef,
        (snap) => {
          setCounts((prev) => ({ ...prev, questions: snap.size }));
          setCountLoading(false);
        },
        () => setCountLoading(false)
      )
    );

    unsubscribers.push(
      onSnapshot(
        linkCountRef,
        (snap) => {
          setCounts((prev) => ({ ...prev, links: snap.size }));
          setCountLoading(false);
        },
        () => setCountLoading(false)
      )
    );

    unsubscribers.push(
      onSnapshot(
        alertCountRef,
        (snap) => {
          setCounts((prev) => ({ ...prev, alerts: snap.size }));
          setCountLoading(false);
        },
        () => setCountLoading(false)
      )
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
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result?.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5, flexDirection: 'column', alignItems: 'flex-end' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleInstallClick}
          disabled={!installPrompt && !isIosInstallHint}
          sx={{ borderRadius: 2 }}
        >
          Install app
        </Button>
        {isIosInstallHint && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            iOS: Share → Add to Home Screen
          </Typography>
        )}
      </Box>
      <Card
        sx={{
          mb: 3,
          overflow: 'hidden',
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(255,173,153,0.9) 0%, rgba(255,125,110,0.95) 100%)',
          color: '#fff'
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ maxWidth: 720 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome back
            </Typography>
            <Typography sx={{ opacity: 0.9, mb: 2 }}>
              A quick pulse on the CS&E department. Jump into the latest updates or start a new thread.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button component={RouterLink} to="/feed" variant="contained" sx={{ backgroundColor: '#fff', color: '#F26459' }}>
                View feed
              </Button>
              <Button component={RouterLink} to="/messages" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.7)', color: '#fff' }}>
                Open chat
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 2, border: '1px solid rgba(255, 173, 153, 0.25)' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <Stack alignItems="center" spacing={0.5}>
              <IconButton
                size="large"
                sx={{ backgroundColor: 'rgba(255, 173, 153, 0.2)', color: 'primary.main', borderRadius: 2 }}
              >
                <DynamicFeedIcon />
              </IconButton>
              {countLoading ? (
                <Skeleton variant="text" width={24} />
              ) : (
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {counts.feed}
                </Typography>
              )}
            </Stack>
            <Stack alignItems="center" spacing={0.5}>
              <IconButton
                size="large"
                sx={{ backgroundColor: 'rgba(255, 173, 153, 0.2)', color: 'primary.main', borderRadius: 2 }}
              >
                <WorkspacesIcon />
              </IconButton>
              {countLoading ? (
                <Skeleton variant="text" width={24} />
              ) : (
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {counts.projects}
                </Typography>
              )}
            </Stack>
            <Stack alignItems="center" spacing={0.5}>
              <IconButton
                size="large"
                sx={{ backgroundColor: 'rgba(255, 173, 153, 0.2)', color: 'primary.main', borderRadius: 2 }}
              >
                <QuestionAnswerIcon />
              </IconButton>
              {countLoading ? (
                <Skeleton variant="text" width={24} />
              ) : (
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {counts.questions}
                </Typography>
              )}
            </Stack>
            <Stack alignItems="center" spacing={0.5}>
              <IconButton
                size="large"
                sx={{ backgroundColor: 'rgba(255, 173, 153, 0.2)', color: 'primary.main', borderRadius: 2 }}
              >
                <LinkIcon />
              </IconButton>
              {countLoading ? (
                <Skeleton variant="text" width={24} />
              ) : (
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {counts.links}
                </Typography>
              )}
            </Stack>
          </Stack>
          <Typography variant="subtitle2" color="text.secondary">
            Department totals
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <RecentCard
            title="Recent feed activity"
            items={recentFeed}
            loading={recentLoading}
            emptyLabel="No posts yet."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentCard
            title="Recent projects"
            items={recentProjects}
            loading={recentLoading}
            emptyLabel="No projects yet."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentCard
            title="Recent questions"
            items={recentQuestions}
            loading={recentLoading}
            emptyLabel="No questions yet."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentCard
            title="Recent alerts"
            items={recentAlerts}
            loading={recentLoading}
            emptyLabel="No alerts yet."
          />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Quick navigation
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <NavCard
            to="/feed"
            title="Department feed"
            subtitle="Share the latest updates"
            icon={<DynamicFeedIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <NavCard
            to="/projects"
            title="Projects board"
            subtitle="Track side work and demos"
            icon={<WorkspacesIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <NavCard
            to="/messages"
            title="Group chat"
            subtitle="Jump into live channels"
            icon={<ChatIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <NavCard
            to="/qa"
            title="Q&A"
            subtitle="Get answers fast"
            icon={<QuestionAnswerIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <NavCard
            to="/links"
            title="Saved links"
            subtitle="Curate articles and videos"
            icon={<LinkIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <NavCard
            to="/tubes"
            title="Tubes"
            subtitle="Share YouTube videos"
            icon={<YouTubeIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <NavCard
            to="/zen"
            title="Moments of ZEN"
            subtitle="Share calm and gratitude"
            icon={<SpaIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <NavCard
            to="/alerts"
            title="Broadcast alert"
            subtitle="Send an all-hands ping"
            icon={<CampaignIcon />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
