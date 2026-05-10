import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Step, StepLabel, Stepper, Chip, IconButton } from '@mui/material';
import { PlayArrow, Pause, SkipNext, SkipPrevious, VolumeUp, VolumeOff, Highlight } from '@mui/icons-material';
import { useApp } from '../../store/appStore';
import { GuidedStep } from '../../types';

interface GuidedTourProps {
  steps: GuidedStep[];
  autoStart?: boolean;
  onComplete?: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ steps, autoStart = false, onComplete }) => {
  const { state } = useApp();
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(!state.guidanceConfig.voicePrompts);

  useEffect(() => {
    if (autoStart && state.guidanceConfig.enabled) {
      setIsPlaying(true);
    }
  }, [autoStart, state.guidanceConfig.enabled]);

  useEffect(() => {
    if (!isPlaying || !state.guidanceConfig.stepByStep) return;

    const timer = setTimeout(() => {
      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
      } else {
        setIsPlaying(false);
        onComplete?.();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, activeStep, steps.length, state.guidanceConfig.stepByStep, onComplete]);

  useEffect(() => {
    if (state.guidanceConfig.voicePrompts && !isMuted && steps[activeStep]) {
      speak(steps[activeStep].description);
    }
  }, [activeStep, state.guidanceConfig.voicePrompts, isMuted, steps]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      onComplete?.();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const currentStep = steps[activeStep];

  if (!state.guidanceConfig.enabled) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((step) => (
          <Step key={step.id}>
            <StepLabel>{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: 'primary.light',
          border: state.guidanceConfig.visualHighlights ? '2px solid primary.main' : 'none',
          boxShadow: state.guidanceConfig.visualHighlights ? '0 0 20px rgba(102, 126, 234, 0.3)' : 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip label={`步骤 ${activeStep + 1} / ${steps.length}`} color="primary" />
          {currentStep.highlightElement && (
            <Chip icon={<Highlight />} label={currentStep.highlightElement} />
          )}
        </Box>

        <Typography variant="h6" gutterBottom>
          {currentStep.title}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {currentStep.description}
        </Typography>

        {state.guidanceConfig.animations && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 40,
              height: 40,
              border: '4px solid #667eea',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: isPlaying ? 'spin 1s linear infinite' : 'none',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleBack} disabled={activeStep === 0}>
          <SkipPrevious />
        </IconButton>

        <Button
          variant="contained"
          onClick={handleTogglePlay}
          startIcon={isPlaying ? <Pause /> : <PlayArrow />}
        >
          {isPlaying ? '暂停' : '播放'}
        </Button>

        <IconButton onClick={handleNext} disabled={activeStep === steps.length - 1}>
          <SkipNext />
        </IconButton>

        <IconButton onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
      </Box>
    </Box>
  );
};

export const GuidanceHint: React.FC<{ message: string; type?: 'info' | 'warning' | 'success' }> = ({ message, type = 'info' }) => {
  const { state } = useApp();
  
  if (!state.guidanceConfig.enabled) return null;

  const colors = {
    info: 'primary',
    warning: 'warning',
    success: 'success',
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        backgroundColor: `${colors[type]}.light`,
        borderLeft: `4px solid ${colors[type]}.main`,
        mt: 2,
      }}
    >
      <Typography variant="body1" color={`${colors[type]}.dark`}>
        💡 {message}
      </Typography>
    </Box>
  );
};
