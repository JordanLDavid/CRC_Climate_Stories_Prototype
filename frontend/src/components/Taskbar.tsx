// src/components/Taskbar.tsx
import { Link } from 'react-router-dom';
import './Taskbar.css';

const Taskbar: React.FC = () => {

  return (
    <nav className="taskbar">
      <Link to="/">Maps</Link>
      <Link to="/posts">Stories</Link>
    </nav>
  );
};

export default Taskbar;
