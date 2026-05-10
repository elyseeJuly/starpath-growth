import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Avatar, Button, Dialog, DialogTitle, DialogContent, Chip } from '@mui/material';
import { Person, TrendingUp, GpsFixed, Warning, AutoAwesome } from '@mui/icons-material';
import { useApp } from '../../store/appStore';
import { getProfile, getSuggestion, updateProfile } from '../../utils/api';
import { AbilityProfile } from '../../types';
import { GuidanceHint } from '../GuidedTour/GuidedTour';

export const ProfilePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [profile, setProfile] = useState<AbilityProfile | null>(null);
  const [suggestions, setSuggestions] = useState<{ suggestions: string[]; focus_areas: string[] } | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editProfile, setEditProfile] = useState<Partial<AbilityProfile>>({});

  useEffect(() => {
    if (state.currentUser?.id) {
      getProfile(state.currentUser.id).then(data => {
        setProfile(data);
        setEditProfile(data);
      });
      getSuggestion(state.currentUser.id).then(setSuggestions);
    }
  }, [state.currentUser]);

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleSave = async () => {
    if (state.currentUser?.id && editProfile) {
      const updated = await updateProfile(state.currentUser.id, editProfile as Record<string, number>);
      setProfile(updated);
      dispatch({ type: 'SET_PROFILE', payload: updated });
      setShowEditDialog(false);
    }
  };

  const abilityItems = profile ? [
    { key: 'social_ability', label: '社交能力', icon: User, desc: '与人交往、理解社交规则的能力' },
    { key: 'cognitive_ability', label: '认知能力', icon: Target, desc: '注意力、记忆力、问题解决能力' },
    { key: 'daily_living_ability', label: '生活自理', icon: AutoAwesome, desc: '饮食起居、自我照顾的能力' },
    { key: 'emotion_management', label: '情绪管理', icon: Warning, desc: '识别和调节情绪的能力' },
    { key: 'communication_ability', label: '沟通能力', icon: TrendingUp, desc: '语言表达和理解能力' },
    { key: 'vocational_ability', label: '职业能力', icon: Target, desc: '完成工作任务的能力' },
    { key: 'adaptability', label: '适应能力', icon: TrendingUp, desc: '适应新环境和变化的能力' },
    { key: 'sensory_ability', label: '感知觉能力', icon: AutoAwesome, desc: '感官处理和整合能力' },
  ] : [];

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'success';
    if (score >= 3) return 'warning';
    return 'error';
  };

  const avgScore = profile ? (
    (profile.social_ability +
      profile.cognitive_ability +
      profile.daily_living_ability +
      profile.emotion_management +
      profile.communication_ability +
      profile.vocational_ability +
      profile.adaptability +
      profile.sensory_ability) / 8
  ) : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">🧠 能力画像</Typography>
        {(state.currentRole === 'teacher' || state.currentRole === 'admin') && (
          <Button variant="contained" onClick={handleEdit}>
            编辑能力评分
          </Button>
        )}
      </Box>

      <GuidanceHint message="这里展示您的各项能力评分，包括社交、认知、生活自理等八个维度" />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 3, bgcolor: 'primary.main' }}>
              <User sx={{ width: 60, height: 60 }} />
            </Avatar>
            <Typography variant="h5">{state.currentUser?.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              患者ID: #{state.currentUser?.id}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary">综合能力评分</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea' }}>{avgScore.toFixed(1)}</span>
                <span style={{ fontSize: '1.5rem', color: '#666' }}>/5</span>
              </Typography>
              <div style={{ height: 10, backgroundColor: '#eee', borderRadius: 5, mt: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(avgScore / 5) * 100}%`,
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 5,
                  }}
                />
              </div>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>📊 各维度能力详情</Typography>
            <Grid container spacing={2}>
              {abilityItems.map((item) => {
                const Icon = item.icon;
                const value = profile?.[item.key as keyof AbilityProfile] as number || 0;
                return (
                  <Grid item xs={12} sm={6} key={item.key}>
                    <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Icon />
                        <div>
                          <Typography variant="body1" fontWeight="medium">{item.label}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                        </div>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <div style={{ flex: 1, height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${(value / 5) * 100}%`,
                              background: value >= 4 ? 'linear-gradient(90deg, #28a745, #20c997)' :
                                value >= 3 ? 'linear-gradient(90deg, #ffc107, #ff8f00)' :
                                'linear-gradient(90deg, #dc3545, #fd7e14)',
                              borderRadius: 4,
                            }}
                          />
                        </div>
                        <Chip label={`${value}/5`} color={getScoreColor(value) as any} size="small" />
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {suggestions && (
        <Paper sx={{ p: 4, mt: 3 }}>
          <Typography variant="h6" gutterBottom>💡 干预建议</Typography>
          {suggestions.focus_areas.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">重点关注领域：</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                {suggestions.focus_areas.map((area) => (
                  <Chip key={area} label={area} color="warning" />
                ))}
              </Box>
            </Box>
          )}
          <Box>
            <Typography variant="body2" color="text.secondary">具体建议：</Typography>
            <ul style={{ listStyle: 'none', padding: 0, mt: 2 }}>
              {suggestions.suggestions.map((suggestion, index) => (
                <li key={index} style={{ padding: '10px 15px', backgroundColor: '#f8f9fa', borderRadius: 8, marginBottom: 10, borderLeft: '4px solid #667eea' }}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </Box>
        </Paper>
      )}

      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="md">
        <DialogTitle>编辑能力评分</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {abilityItems.map((item) => (
              <Grid item xs={12} sm={6} key={item.key}>
                <Typography variant="body1">{item.label}</Typography>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={editProfile[item.key as keyof AbilityProfile] as number || 1}
                  onChange={(e) => setEditProfile({ ...editProfile, [item.key]: parseFloat(e.target.value) })}
                  style={{ width: '100%', marginTop: 8 }}
                />
                <Typography variant="body2" color="text.secondary">
                  当前值: {editProfile[item.key as keyof AbilityProfile]}
                </Typography>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setShowEditDialog(false)}>取消</Button>
            <Button variant="contained" onClick={handleSave}>保存</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
