import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex flex-col md:flex-row font-sans">
      <Navbar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
    
  );
}