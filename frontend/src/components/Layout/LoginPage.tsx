import React, { useState } from 'react';
import { Box, Button, Container, CssBaseline, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Avatar } from '@mui/material';
import { Coffee, Person, Security } from '@mui/icons-material';
import { useApp } from '../../store/appStore';
import { UserRole } from '../../types';
import { createUser } from '../../utils/api';

export const LoginPage: React.FC = () => {
  const { dispatch } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        const newUser = await createUser({
          username,
          email,
          name,
          role,
          password,
        });

        dispatch({
          type: 'LOGIN',
          payload: {
            user: {
              id: newUser.id,
              username: newUser.username,
              email: newUser.email,
              name: newUser.name,
              role: newUser.role,
              created_at: newUser.created_at,
              updated_at: newUser.updated_at,
            },
            role: newUser.role as UserRole,
          },
        });
      } else {
        dispatch({
          type: 'LOGIN',
          payload: {
            user: {
              id: 1,
              username,
              email: `${username}@example.com`,
              name: name || username,
              role,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            role,
          },
        });
      }
    } catch (err) {
      setError('登录失败，请重试');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <Coffee />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isRegister ? '注册账户' : '欢迎登录'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {isRegister && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="邮箱"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus={!isRegister}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>角色</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              label="角色"
            >
              <MenuItem value="patient">
                <Person sx={{ mr: 2 }} />
                患者
              </MenuItem>
              <MenuItem value="parent">
                <Shield sx={{ mr: 2 }} />
                家长
              </MenuItem>
              <MenuItem value="teacher">
                <User sx={{ mr: 2 }} />
                康复老师
              </MenuItem>
              <MenuItem value="admin">
                <Shield sx={{ mr: 2 }} />
                管理员
              </MenuItem>
            </Select>
          </FormControl>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isRegister ? '注册' : '登录'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? '已有账户？立即登录' : '还没有账户？立即注册'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
