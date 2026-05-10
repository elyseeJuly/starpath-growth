import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography, Chip, Button, Avatar, Paper } from '@mui/material';
import { Coffee, TrendingUp, GpsFixed, Schedule, EmojiEvents } from '@mui/icons-material';
import { useApp } from '../../store/appStore';
import { getProfile, getTaskRecords } from '../../utils/api';
import { AbilityProfile, TaskRecord } from '../../types';
import { GuidanceHint } from '../GuidedTour/GuidedTour';

export const Dashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const [profile, setProfile] = useState<AbilityProfile | null>(null);
  const [recentRecords, setRecentRecords] = useState<TaskRecord[]>([]);
  const [todayStats, setTodayStats] = useState({ completed: 0, total: 5, avgScore: 0 });

  useEffect(() => {
    if (state.currentUser?.id) {
      getProfile(state.currentUser.id).then(data => {
        setProfile(data);
        dispatch({ type: 'SET_PROFILE', payload: data });
      });
      getTaskRecords(state.currentUser.id).then(data => {
        setRecentRecords(data.slice(-5));
        const today = data.filter(r => {
          const recordDate = new Date(r.created_at);
          const today = new Date();
          return recordDate.toDateString() === today.toDateString();
        });
        setTodayStats({
          completed: today.length,
          total: 5,
          avgScore: today.length > 0 ? Math.round(today.reduce((sum, r) => sum + r.quality_score, 0) / today.length) : 0,
        });
      });
    }
  }, [state.currentUser, dispatch]);

  const avgAbility = profile ? (
    profile.social_ability +
    profile.cognitive_ability +
    profile.daily_living_ability +
    profile.emotion_management +
    profile.communication_ability +
    profile.vocational_ability +
    profile.adaptability +
    profile.sensory_ability
  ) / 8 : 0;

  const emotionColors: Record<string, string> = {
    '平静': 'success',
    '焦虑': 'warning',
    '愉快': 'info',
    '烦躁': 'error',
  };

  const emotionIcons: Record<string, string> = {
    '平静': '😊',
    '焦虑': '😟',
    '愉快': '😄',
    '烦躁': '😠',
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        👋 欢迎回来，{state.currentUser?.name}
      </Typography>

      <GuidanceHint message="这是您的个人仪表板，可以查看能力画像、任务进度和干预建议" />

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <GpsFixed />
                </Avatar>
                <div>
                  <Typography variant="body2" color="text.secondary">今日任务</Typography>
                  <Typography variant="h4">{todayStats.completed}/{todayStats.total}</Typography>
                </div>
              </Box>
              <div style={{ height: 8, backgroundColor: '#eee', borderRadius: 4, mt: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(todayStats.completed / todayStats.total) * 100}%`,
                    backgroundColor: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 4,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TrendingUp />
                </Avatar>
                <div>
                  <Typography variant="body2" color="text.secondary">平均能力</Typography>
                  <Typography variant="h4">{avgAbility.toFixed(1)}/5</Typography>
                </div>
              </Box>
              <div style={{ height: 8, backgroundColor: '#eee', borderRadius: 4, mt: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(avgAbility / 5) * 100}%`,
                    background: 'linear-gradient(90deg, #28a745 0%, #20c997 100%)',
                    borderRadius: 4,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <EmojiEvents />
                </Avatar>
                <div>
                  <Typography variant="body2" color="text.secondary">平均评分</Typography>
                  <Typography variant="h4">{todayStats.avgScore}/5</Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Clock />
                </Avatar>
                <div>
                  <Typography variant="body2" color="text.secondary">连续训练</Typography>
                  <Typography variant="h4">30天</Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>📊 能力维度概览</Typography>
            <Grid container spacing={2}>
              {profile && [
                { label: '社交能力', value: profile.social_ability },
                { label: '认知能力', value: profile.cognitive_ability },
                { label: '生活自理', value: profile.daily_living_ability },
                { label: '情绪管理', value: profile.emotion_management },
                { label: '沟通能力', value: profile.communication_ability },
                { label: '职业能力', value: profile.vocational_ability },
                { label: '适应能力', value: profile.adaptability },
                { label: '感知觉', value: profile.sensory_ability },
              ].map((item) => (
                <Grid item xs={6} key={item.label}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography variant="body2" fontWeight="bold">{item.value}/5</Typography>
                  </Box>
                  <div style={{ height: 6, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(item.value / 5) * 100}%`,
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>📝 最近记录</Typography>
            <Box sx={{ maxHeight: 250, overflowY: 'auto' }}>
              {recentRecords.map((record) => (
                <Box
                  key={record.id}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: 'background.paper',
                    mb: 2,
                    borderLeft: `4px solid ${record.quality_score >= 4 ? '#28a745' : record.quality_score >= 3 ? '#ffc107' : '#dc3545'}`,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight="medium">任务 #{record.task_id}</Typography>
                    <Chip
                      size="small"
                      label={emotionIcons[record.emotion_state]}
                      color={emotionColors[record.emotion_state] as any}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    完成率: {record.steps_completed}/{record.total_steps} | 评分: {record.quality_score}/5
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {state.currentRole === 'patient' && (
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>🎯 今日任务列表</Typography>
            <Grid container spacing={2}>
              {['制作咖啡', '接待顾客', '清洁场地', '清洗杯具', '整理货架'].map((task, index) => (
                <Grid item xs={12} sm={6} md={4} key={task}>
                  <Card
                    sx={{
                      p: 2,
                      backgroundColor: index < todayStats.completed ? 'success.light' : 'background.paper',
                      borderLeft: index < todayStats.completed ? '4px solid #28a745' : '4px solid #ddd',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Coffee />
                      <Typography variant="body1">{task}</Typography>
                      {index < todayStats.completed && <Chip label="已完成" color="success" size="small" />}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      )}
    </Box>
  );
};
