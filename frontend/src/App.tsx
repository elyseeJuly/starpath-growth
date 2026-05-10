import { AppProvider, useApp } from './store/appStore';
import { LoginPage } from './components/Layout/LoginPage';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProfilePage } from './components/Profile/ProfilePage';
import { TaskRecordPage } from './components/TaskRecord/TaskRecordPage';
import { SimulationPage } from './components/Simulation/SimulationPage';
import { PatientManagement } from './pages/PatientManagement';
import { AnalyticsPage } from './pages/AnalyticsPage';

function AppContent() {
  const { state } = useApp();

  if (!state.isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <Layout>
      {state.currentPage === 'dashboard' && <Dashboard />}
      {state.currentPage === 'profile' && <ProfilePage />}
      {state.currentPage === 'tasks' && <TaskRecordPage />}
      {state.currentPage === 'simulation' && <SimulationPage />}
      {state.currentPage === 'patients' && <PatientManagement />}
      {state.currentPage === 'analytics' && <AnalyticsPage />}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
