import React from 'react';
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ChannelList = ({ channels, selectedId, onSelect, onCreate }) => (
  <Card sx={{ borderRadius: 2, border: '1px solid rgba(255, 173, 153, 0.2)' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Channels
        </Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={onCreate}>
          New
        </Button>
      </Box>
      <List dense sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {channels.map((channel) => (
          <ListItemButton
            key={channel.id}
            selected={channel.id === selectedId}
            onClick={() => onSelect(channel)}
            sx={{
              borderRadius: 2,
              my: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 173, 153, 0.3)',
                '&:hover': { backgroundColor: 'rgba(255, 173, 153, 0.35)' }
              }
            }}
          >
            <ListItemText primary={channel.name} />
          </ListItemButton>
        ))}
        {channels.length === 0 && (
          <Typography color="text.secondary" sx={{ p: 2 }}>
            No channels yet.
          </Typography>
        )}
      </List>
    </CardContent>
  </Card>
);

export default ChannelList;
