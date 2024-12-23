// src/components/Taskbar.tsx
import { Link } from 'react-router-dom';
import './Taskbar.css';

const Taskbar: React.FC = () => {

  return (
    <nav className="taskbar">
      <Link to="/">Posts</Link>
      <Link to="/map">Maps</Link>
    </nav>
  );
};

export default Taskbar;
