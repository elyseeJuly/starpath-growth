import React, { useState } from 'react';
import { Box, Paper, Typography, Grid, Button, Slider, FormControl, InputLabel, Select, MenuItem, Chip, Stepper, Step, StepLabel } from '@mui/material';
import { PlayCircle, Refresh, Coffee, Group, Checklist, CheckCircle, Cancel, TrendingUp, TrendingDown } from '@mui/icons-material';
import { useApp } from '../../store/appStore';
import { runSimulation } from '../../utils/api';
import { GuidedStep } from '../../types';
import { GuidedTour, GuidanceHint } from '../GuidedTour/GuidedTour';

const scenarios = [
  { value: 'coffee_shop', label: '☕ 咖啡馆场景', icon: Coffee },
  { value: 'social_interaction', label: '👥 社交互动', icon: Users },
  { value: 'task_execution', label: '📋 任务执行', icon: Checklist },
];

const abilityLabels: Record<string, string> = {
  social_ability: '社交能力',
  cognitive_ability: '认知能力',
  communication_ability: '沟通能力',
  vocational_ability: '职业能力',
  emotion_management: '情绪管理',
};

export const SimulationPage: React.FC = () => {
  const { state } = useApp();
  const [scenario, setScenario] = useState('coffee_shop');
  const [steps, setSteps] = useState(10);
  const [initialAbilities, setInitialAbilities] = useState({
    social_ability: 2,
    cognitive_ability: 2,
    communication_ability: 2,
    vocational_ability: 2,
    emotion_management: 2,
  });
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimulationResult(null);

    const result = await runSimulation({
      scenario,
      patient_id: state.currentUser?.id,
      initial_abilities: initialAbilities,
      steps,
    });

    setSimulationResult(result);
    setIsSimulating(false);
  };

  const handleReset = () => {
    setScenario('coffee_shop');
    setSteps(10);
    setInitialAbilities({
      social_ability: 2,
      cognitive_ability: 2,
      communication_ability: 2,
      vocational_ability: 2,
      emotion_management: 2,
    });
    setSimulationResult(null);
  };

  const guidedSteps: GuidedStep[] = [
    {
      id: 'step1',
      title: '选择场景',
      description: '请从下拉菜单中选择要模拟的场景类型',
      highlightElement: '场景选择',
    },
    {
      id: 'step2',
      title: '设置参数',
      description: '调整模拟步数和初始能力值',
      highlightElement: '参数设置',
    },
    {
      id: 'step3',
      title: '开始模拟',
      description: '点击开始按钮运行场景模拟',
      highlightElement: '开始按钮',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🎮 场景模拟
      </Typography>

      <GuidanceHint message="通过模拟不同场景，预测患者在各种情境下的表现和能力变化" />

      {state.currentRole === 'patient' && <GuidedTour steps={guidedSteps} autoStart={!simulationResult} />}

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>⚙️ 模拟设置</Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>选择场景</InputLabel>
              <Select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                label="选择场景"
              >
                {scenarios.map((s) => {
                  const Icon = s.icon;
                  return (
                    <MenuItem key={s.value} value={s.value}>
                      <Icon sx={{ mr: 2 }} />
                      {s.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>模拟步数: {steps} 步</InputLabel>
              <Slider
                value={steps}
                onChange={(e, value) => setSteps(value as number)}
                min={5}
                max={20}
                marks={[
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                  { value: 15, label: '15' },
                  { value: 20, label: '20' },
                ]}
              />
            </FormControl>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              设置初始能力值（1-5分）：
            </Typography>

            {Object.entries(initialAbilities).map(([key, value]) => (
              <FormControl fullWidth margin="normal" key={key}>
                <InputLabel>{abilityLabels[key]}: {value}</InputLabel>
                <Slider
                  value={value}
                  onChange={(e, val) => setInitialAbilities({ ...initialAbilities, [key]: val as number })}
                  min={1}
                  max={5}
                  step={0.5}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                    { value: 4, label: '4' },
                    { value: 5, label: '5' },
                  ]}
                />
              </FormControl>
            ))}

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleRunSimulation}
                disabled={isSimulating}
                startIcon={<PlayCircle />}
              >
                {isSimulating ? '运行中...' : '开始模拟'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                startIcon={<Refresh />}
              >
                重置
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>📊 模拟结果</Typography>
            
            {!simulationResult ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Coffee sx={{ width: 64, height: 64, color: '#ccc', mx: 'auto', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  点击"开始模拟"按钮运行场景演示
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">成功率</Typography>
                    <Chip
                      label={`${simulationResult.results.summary.success_rate}%`}
                      color={simulationResult.results.summary.success_rate >= 70 ? 'success' : simulationResult.results.summary.success_rate >= 50 ? 'warning' : 'error'}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">总体评价</Typography>
                    <Chip
                      label={simulationResult.results.summary.overall_progress}
                      color={simulationResult.results.summary.overall_progress === '进步' ? 'success' : 'warning'}
                    />
                  </Box>
                </Box>

                <Typography variant="subtitle1" gutterBottom>能力变化</Typography>
                <Grid container spacing={2} mb={4}>
                  {Object.entries(simulationResult.results.initial_abilities).map(([key, initial]) => {
                    const final = simulationResult.results.final_abilities[key];
                    const improvement = final - initial;
                    return (
                      <Grid item xs={6} key={key}>
                        <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
                          <Typography variant="body2">{abilityLabels[key]}</Typography>
                          <Typography variant="h6">
                            {initial} → <span style={{ color: improvement >= 0 ? '#28a745' : '#dc3545' }}>{final.toFixed(1)}</span>
                          </Typography>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {improvement >= 0 ? <TrendingUp /> : <TrendingDown />}
                            <Typography variant="body2" style={{ color: improvement >= 0 ? '#28a745' : '#dc3545' }}>
                              {improvement >= 0 ? '+' : ''}{improvement.toFixed(2)}
                            </Typography>
                          </div>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>

                <Typography variant="subtitle1" gutterBottom>模拟过程</Typography>
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  <Stepper orientation="vertical" activeStep={simulationResult.results.steps.length - 1}>
                    {simulationResult.results.steps.map((step: any, index: number) => (
                      <Step key={index}>
                        <StepLabel>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {step.success ? <CheckCircle color="success" /> : <XCircle color="error" />}
                            <span>{step.interaction.description}</span>
                          </Box>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
