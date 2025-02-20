import { Link } from 'react-router-dom';
import './Taskbar.css';

const Taskbar: React.FC = () => {
  return (
    <nav className="taskbar">
      <div className="taskbar-content">
        <a className="taskbar-title">Climate Stories Map</a>
        <div className="taskbar-buttons">
          <Link to="/posts" className="taskbar-button">Posts</Link>
          <Link to="/" className="taskbar-button">Map</Link>
        </div>
      </div>
    </nav>
  );
};

export default Taskbar;