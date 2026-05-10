import React, { useState } from 'react';
import { Box, Paper, Typography, Grid, Button, Table, TableHead, TableBody, TableRow, TableCell, Chip, Dialog, DialogTitle, DialogContent, Avatar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Group, Add, Search, Edit, Delete, Visibility } from '@mui/icons-material';
import { User, UserRole } from '../types';

const mockPatients: User[] = [
  { id: 1, username: 'zhangsan', email: 'zhangsan@example.com', name: '张三', role: 'patient', created_at: '2024-01-01', updated_at: '2024-01-15' },
  { id: 2, username: 'lisi', email: 'lisi@example.com', name: '李四', role: 'patient', created_at: '2024-01-05', updated_at: '2024-01-14' },
  { id: 3, username: 'wangwu', email: 'wangwu@example.com', name: '王五', role: 'patient', created_at: '2024-01-10', updated_at: '2024-01-13' },
];

const mockProfiles: Record<number, { avgAbility: number; status: string }> = {
  1: { avgAbility: 3.2, status: '进行中' },
  2: { avgAbility: 2.8, status: '进行中' },
  3: { avgAbility: 4.1, status: '已完成' },
};

export const PatientManagement: React.FC = () => {
  const [patients] = useState<User[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filteredPatients = patients.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetail = (patient: User) => {
    setSelectedPatient(patient);
    setShowDetailDialog(true);
  };

  const roleLabels: Record<string, string> = {
    patient: '患者',
    parent: '家长',
    teacher: '康复老师',
    admin: '管理员',
  };

  const statusColors: Record<string, string> = {
    '进行中': 'warning',
    '已完成': 'success',
    '待评估': 'default',
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">👥 患者管理</Typography>
        <Button variant="contained" startIcon={<Plus />}>
          添加患者
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              placeholder="搜索患者..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: 14,
              }}
            />
          </div>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>患者信息</TableCell>
              <TableCell>能力评分</TableCell>
              <TableCell>训练状态</TableCell>
              <TableCell>注册日期</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => {
              const profile = mockProfiles[patient.id];
              return (
                <TableRow key={patient.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {patient.name.charAt(0)}
                      </Avatar>
                      <div>
                        <Typography variant="body1" fontWeight="medium">{patient.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{patient.email}</Typography>
                      </div>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={`${profile?.avgAbility || 0}/5`} color={profile?.avgAbility >= 4 ? 'success' : profile?.avgAbility >= 3 ? 'warning' : 'error'} />
                  </TableCell>
                  <TableCell>
                    <Chip label={profile?.status || '待评估'} color={statusColors[profile?.status || '待评估'] as any} />
                  </TableCell>
                  <TableCell>{patient.created_at}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" onClick={() => handleViewDetail(patient)}>
                        <Visibility />
                      </Button>
                      <Button size="small">
                        <Edit />
                      </Button>
                      <Button size="small" color="error">
                        <Trash2 />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={showDetailDialog} onClose={() => setShowDetailDialog(false)} maxWidth="md">
        {selectedPatient && (
          <>
            <DialogTitle>患者详情 - {selectedPatient.name}</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Avatar sx={{ width: 100, height: 100, mx: 'auto', bgcolor: 'primary.main' }}>
                    {selectedPatient.name.charAt(0)}
                  </Avatar>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6">{selectedPatient.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedPatient.email}</Typography>
                  <Chip label={roleLabels[selectedPatient.role]} sx={{ mt: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>能力画像</Typography>
                  <Grid container spacing={2}>
                    {['社交能力', '认知能力', '生活自理', '情绪管理', '沟通能力', '职业能力', '适应能力', '感知觉'].map((label, index) => (
                      <Grid item xs={6} key={label}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{label}</Typography>
                          <Typography variant="body2" fontWeight="bold">{(3 + Math.random()).toFixed(1)}/5</Typography>
                        </Box>
                        <div style={{ height: 6, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${((3 + Math.random()) / 5) * 100}%`,
                              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: 3,
                            }}
                          />
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};
