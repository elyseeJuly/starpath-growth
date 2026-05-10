import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { TrendingUp, Group, GpsFixed, EmojiEvents } from '@mui/icons-material';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export const AnalyticsPage: React.FC = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    setChartData({
      weeklyData: {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [
          {
            label: '任务完成数',
            data: [5, 4, 6, 5, 7, 4, 5],
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
          },
          {
            label: '干预次数',
            data: [3, 2, 4, 2, 1, 3, 2],
            backgroundColor: 'rgba(255, 193, 7, 0.8)',
          },
        ],
      },
      monthlyData: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
          {
            label: '平均能力评分',
            data: [2.5, 2.8, 3.0, 3.2, 3.5, 3.8],
            borderColor: 'rgba(102, 126, 234, 1)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            fill: true,
          },
        ],
      },
      abilityData: {
        labels: ['社交能力', '认知能力', '生活自理', '情绪管理', '沟通能力', '职业能力', '适应能力', '感知觉'],
        datasets: [
          {
            label: '平均评分',
            data: [3.2, 3.8, 3.5, 2.8, 3.0, 4.0, 2.5, 3.3],
            backgroundColor: 'rgba(118, 75, 162, 0.8)',
          },
        ],
      },
    });
  }, []);

  const stats = [
    { label: '总患者数', value: 120, icon: Users, color: 'primary' },
    { label: '日均任务完成', value: 450, icon: Target, color: 'success' },
    { label: '平均能力提升', value: '+23%', icon: TrendingUp, color: 'warning' },
    { label: '训练达标率', value: '78%', icon: Award, color: 'info' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        📈 数据分析
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Icon sx={{ color: `primary.${stat.color}` }} />
                  <div>
                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                    <Typography variant="h4">{stat.value}</Typography>
                  </div>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>📊 本周任务完成统计</Typography>
            {chartData && (
              <Bar
                data={chartData.weeklyData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' as const },
                  },
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>📈 能力成长趋势</Typography>
            {chartData && (
              <Line
                data={chartData.monthlyData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: { min: 0, max: 5 },
                  },
                }}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>📊 各维度能力分布</Typography>
            {chartData && (
              <Bar
                data={chartData.abilityData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: { min: 0, max: 5 },
                  },
                }}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>🏆 进步最快患者</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { name: '张三', improvement: '+1.2', avatar: '张' },
                { name: '李四', improvement: '+1.0', avatar: '李' },
                { name: '王五', improvement: '+0.8', avatar: '王' },
                { name: '赵六', improvement: '+0.7', avatar: '赵' },
                { name: '钱七', improvement: '+0.6', avatar: '钱' },
              ].map((item, index) => (
                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip label={index + 1} color="primary" size="small" />
                  <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    {item.avatar}
                  </div>
                  <Typography variant="body1" flex={1}>{item.name}</Typography>
                  <Chip label={item.improvement} color="success" size="small" />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>⚠️ 需要关注的领域</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { area: '情绪管理', avgScore: 2.8, count: 35 },
                { area: '适应能力', avgScore: 2.5, count: 42 },
                { area: '社交能力', avgScore: 3.0, count: 28 },
                { area: '沟通能力', avgScore: 3.2, count: 24 },
              ].map((item) => (
                <Box key={item.area} sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">{item.area}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.count}人</Typography>
                  </Box>
                  <div style={{ height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(item.avgScore / 5) * 100}%`,
                        background: item.avgScore >= 3 ? 'linear-gradient(90deg, #ffc107, #ff8f00)' : 'linear-gradient(90deg, #dc3545, #fd7e14)',
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    平均评分: {item.avgScore}/5
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
