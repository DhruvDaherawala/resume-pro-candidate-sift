
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from './Dashboard';

const Index = () => {
  // Simply render the Dashboard as our landing page
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};

export default Index;
