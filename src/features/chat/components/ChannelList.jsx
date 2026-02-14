import React from 'react';
import { Plus } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const ChannelList = ({ channels, selectedId, onSelect, onCreate }) => (
  <Card className="rounded-[2px]">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-gradient">Channels</p>
      <Button size="sm" variant="outline" onClick={onCreate}>
        <Plus size={14} />
        New
      </Button>
    </div>
    <div className="mt-3 space-y-2">
      {channels.map((channel) => (
        <button
          key={channel.id}
          onClick={() => onSelect(channel)}
          className={`w-full rounded-[2px] px-3 py-2 text-left text-xs ${
            channel.id === selectedId
              ? 'bg-white/10 text-white shadow-glow'
              : 'text-white/60 hover:bg-white/5'
          }`}
        >
          #{channel.name}
        </button>
      ))}
      {channels.length === 0 && <p className="text-xs text-white/40">No channels yet.</p>}
    </div>
  </Card>
);

export default ChannelList;
