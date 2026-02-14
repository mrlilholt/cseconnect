import React from 'react';
import { useOnlineUsers } from '../hooks/useOnlineUsers';
import Card from './ui/Card';
import Avatar from './ui/Avatar';
import Skeleton from './ui/Skeleton';

const OnlineUsersPanel = ({ title = 'Online now', max = 8 }) => {
  const { users, loading } = useOnlineUsers();
  const visible = users.slice(0, max);

  return (
    <Card className="rounded-[2px] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gradient">{title}</p>
        {loading ? (
          <Skeleton className="h-4 w-8" />
        ) : (
          <span className="text-xs text-white/50">{users.length} online</span>
        )}
      </div>
      <div className="mt-3">
        {loading ? (
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-9 w-9 rounded-full" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-xs text-white/50">No one is online right now.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {visible.map((user) => (
              <div key={user.id} className="text-center">
                <Avatar
                  src={user.photoURL || ''}
                  fallback={user.displayName?.[0] || user.email?.[0] || 'U'}
                  className="h-9 w-9 border border-white/10"
                />
                <span className="mt-1 block max-w-[72px] truncate text-[10px] text-white/60">
                  {user.displayName || user.email}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default OnlineUsersPanel;
