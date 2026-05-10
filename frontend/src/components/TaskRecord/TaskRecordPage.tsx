import React, { useState } from 'react';
import { Box, Paper, Typography, Grid, TextField, Select, MenuItem, Button, FormControl, InputLabel, Chip, Table, TableHead, TableBody, TableRow, TableCell, Alert } from '@mui/material';
import { Checklist, Send, Coffee } from '@mui/icons-material';
import { useApp } from '../../store/appStore';
import { createTaskRecord, getTaskRecords } from '../../utils/api';
import { TaskRecord, UserRole } from '../../types';
import { GuidanceHint } from '../GuidedTour/GuidedTour';

const taskTypes = [
  { value: '接待顾客', label: '接待顾客' },
  { value: '制作咖啡', label: '制作咖啡' },
  { value: '清洁场地', label: '清洁场地' },
  { value: '清洗杯具', label: '清洗杯具' },
];

const emotionOptions = [
  { value: '平静', label: '😊 平静' },
  { value: '焦虑', label: '😟 焦虑' },
  { value: '愉快', label: '😄 愉快' },
  { value: '烦躁', label: '😠 烦躁' },
];

const formFields = [
  { id: 'taskType', label: '任务类型', type: 'select' as const, required: true, collectType: 'manual' as const, visibleRoles: ['patient', 'parent', 'teacher', 'admin'] },
  { id: 'stepsCompleted', label: '完成步骤', type: 'number' as const, required: true, collectType: 'manual' as const, visibleRoles: ['patient', 'parent', 'teacher', 'admin'], min: 0, max: 10 },
  { id: 'totalSteps', label: '总步骤', type: 'number' as const, required: true, collectType: 'manual' as const, visibleRoles: ['parent', 'teacher', 'admin'], min: 1, max: 10 },
  { id: 'interventionCount', label: '干预次数', type: 'number' as const, required: false, collectType: 'manual' as const, visibleRoles: ['teacher'], min: 0, max: 10 },
  { id: 'qualityScore', label: '完成质量', type: 'select' as const, required: false, collectType: 'manual' as const, visibleRoles: ['teacher', 'admin'] },
  { id: 'emotionState', label: '情绪状态', type: 'select' as const, required: true, collectType: 'manual' as const, visibleRoles: ['patient', 'parent', 'teacher', 'admin'] },
];

export const TaskRecordPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    taskType: '',
    stepsCompleted: 0,
    totalSteps: 5,
    interventionCount: 0,
    qualityScore: '3',
    emotionState: '平静',
  });
  const [taskRecords, setTaskRecords] = useState<TaskRecord[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!formData.taskType || formData.stepsCompleted < 0) {
      return;
    }

    try {
      const record = await createTaskRecord({
        user_id: state.currentUser?.id || 1,
        task_id: 1,
        steps_completed: formData.stepsCompleted,
        total_steps: formData.totalSteps,
        intervention_count: formData.interventionCount,
        quality_score: parseInt(formData.qualityScore),
        emotion_state: formData.emotionState,
      });

      dispatch({ type: 'ADD_TASK_RECORD', payload: record });
      setTaskRecords([record, ...taskRecords]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setFormData({
        taskType: '',
        stepsCompleted: 0,
        totalSteps: 5,
        interventionCount: 0,
        qualityScore: '3',
        emotionState: '平静',
      });
      setSubmitted(false);
    } catch (err) {
      console.error('Failed to create task record:', err);
    }
  };

  const isFieldVisible = (field: typeof formFields[0]) => {
    return field.visibleRoles.includes(state.currentRole);
  };

  const isFieldRequired = (field: typeof formFields[0]) => {
    return field.required && isFieldVisible(field);
  };

  const getCollectTypeColor = (collectType: string) => {
    switch (collectType) {
      case 'manual': return 'primary';
      case 'device': return 'info';
      case 'auto': return 'success';
      default: return 'default';
    }
  };

  const getCollectTypeLabel = (collectType: string) => {
    switch (collectType) {
      case 'manual': return '手动输入';
      case 'device': return '设备采集';
      case 'auto': return '自动采集';
      default: return collectType;
    }
  };

  const emotionColors: Record<string, string> = {
    '平静': 'success',
    '焦虑': 'warning',
    '愉快': 'info',
    '烦躁': 'error',
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        📋 任务记录
      </Typography>

      <GuidanceHint message="请填写任务完成情况，带 * 标记的为必填项" />

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ✅ 任务记录提交成功！
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              <ClipboardList sx={{ mr: 1 }} />
              任务记录表单
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {formFields.filter(isFieldVisible).map((field) => (
                  <Grid item xs={12} key={field.id}>
                    <FormControl fullWidth required={isFieldRequired(field)}>
                      <InputLabel>
                        {field.label}
                        {isFieldRequired(field) && <span style={{ color: '#dc3545', marginLeft: 4 }}>*</span>}
                      </InputLabel>
                      {field.type === 'select' ? (
                        <Select
                          value={formData[field.id as keyof typeof formData] as string}
                          onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                          label={field.label}
                        >
                          {field.id === 'taskType' && taskTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                          {field.id === 'qualityScore' && [1, 2, 3, 4, 5].map((score) => (
                            <MenuItem key={score} value={score.toString()}>
                              {score} - {score === 1 ? '需要大量帮助' : score === 2 ? '需要较多帮助' : score === 3 ? '需要部分帮助' : score === 4 ? '需要少量帮助' : '独立完成'}
                            </MenuItem>
                          ))}
                          {field.id === 'emotionState' && emotionOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <TextField
                          type={field.type}
                          value={formData[field.id as keyof typeof formData] as number}
                          onChange={(e) => setFormData({ ...formData, [field.id]: parseInt(e.target.value) || 0 })}
                          label={field.label}
                          inputProps={{ min: field.min, max: field.max, step: field.step }}
                        />
                      )}
                    </FormControl>
                    <Chip
                      size="small"
                      label={getCollectTypeLabel(field.collectType)}
                      color={getCollectTypeColor(field.collectType) as any}
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 4 }}
                startIcon={<Send />}
              >
                提交记录
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              <Coffee sx={{ mr: 1 }} />
              今日任务列表
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['接待顾客', '制作咖啡', '清洁场地', '清洗杯具', '整理货架'].map((task, index) => (
                <Box
                  key={task}
                  sx={{
                    p: 2,
                    backgroundColor: index < 3 ? 'success.light' : 'background.paper',
                    borderRadius: 1,
                    borderLeft: index < 3 ? '4px solid #28a745' : '4px solid #ddd',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">{task}</Typography>
                    {index < 3 && <Chip label="已完成" color="success" size="small" />}
                    {index === 3 && <Chip label="进行中" color="warning" size="small" />}
                    {index === 4 && <Chip label="待开始" color="default" size="small" />}
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, mt: 3 }}>
        <Typography variant="h6" gutterBottom>📝 任务记录历史</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>时间</TableCell>
              <TableCell>任务类型</TableCell>
              <TableCell>完成度</TableCell>
              <TableCell>干预次数</TableCell>
              <TableCell>质量评分</TableCell>
              <TableCell>情绪状态</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taskRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{new Date(record.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip label={taskTypes.find(t => t.value === record.task_id)?.label || `任务 ${record.task_id}`} />
                </TableCell>
                <TableCell>{record.steps_completed}/{record.total_steps}</TableCell>
                <TableCell>{record.intervention_count}</TableCell>
                <TableCell>
                  <Chip
                    label={`${record.quality_score}/5`}
                    color={record.quality_score >= 4 ? 'success' : record.quality_score >= 3 ? 'warning' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={record.emotion_state}
                    color={emotionColors[record.emotion_state] as any}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};
