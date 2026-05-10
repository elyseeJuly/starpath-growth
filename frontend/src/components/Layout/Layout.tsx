import React from 'react';
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Avatar, Box, Typography, Button } from '@mui/material';
import { Menu, Home, Person, BarChart, Settings, Logout, Coffee, Group, Checklist, PlayCircle } from '@mui/icons-material';
import { useApp } from '../../store/appStore';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { id: 'dashboard', label: '首页', icon: Home },
  { id: 'profile', label: '能力画像', icon: User },
  { id: 'tasks', label: '任务记录', icon: Checklist },
  { id: 'simulation', label: '场景模拟', icon: PlayCircle },
  { id: 'patients', label: '患者管理', icon: Users },
  { id: 'analytics', label: '数据分析', icon: BarChart },
];

const roleMenuItems: Record<string, string[]> = {
  patient: ['dashboard', 'profile', 'tasks', 'simulation'],
  parent: ['dashboard', 'profile', 'tasks', 'patients'],
  teacher: ['dashboard', 'profile', 'tasks', 'patients', 'analytics'],
  admin: ['dashboard', 'profile', 'tasks', 'patients', 'analytics', 'settings'],
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, dispatch } = useApp();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const handleNavClick = (pageId: string) => {
    dispatch({ type: 'SET_PAGE', payload: pageId });
    setMobileOpen(false);
  };

  const visibleItems = roleMenuItems[state.currentRole] || [];

  const drawer = (
    <div>
      <Toolbar sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Coffee sx={{ mr: 2 }} />
        <Typography variant="h6" noWrap>
          StarPath
        </Typography>
      </Toolbar>
      <List>
        {navItems.filter(item => visibleItems.includes(item.id)).map((item) => {
          const Icon = item.icon;
          return (
            <ListItem
              button
              key={item.id}
              selected={state.currentPage === item.id}
              onClick={() => handleNavClick(item.id)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': { backgroundColor: 'primary.light' },
                },
              }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  const roleLabels: Record<string, string> = {
    patient: '患者',
    parent: '家长',
    teacher: '康复老师',
    admin: '管理员',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Coffee sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            StarPath - {roleLabels[state.currentRole]}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">{state.currentUser?.name || '未登录'}</Typography>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {state.currentUser?.name?.charAt(0) || 'U'}
            </Avatar>
            <Button color="inherit" onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              退出
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { xs: 0, sm: 240 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
