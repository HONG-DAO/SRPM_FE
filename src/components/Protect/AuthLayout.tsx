import { Outlet } from 'react-router-dom';
import stockChartImage from '/images/download (1).jpeg';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex items-center justify-center px-8 lg:px-16">
        <Outlet />
      </div>
      
      <div 
        className="hidden lg:block w-1/2 bg-cover bg-center fade-in"
        style={{ 
          backgroundImage: `url(${stockChartImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </div>
  );
};

export default AuthLayout;