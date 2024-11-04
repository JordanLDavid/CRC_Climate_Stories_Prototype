import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Modal from './components/common/Modal';
import PostForm from './components/posts/PostForm';
import PostList from './components/posts/PostList';
import MapWithForm from './components/MapWithForm';
import Taskbar from './components/Taskbar';
import { createPost } from './services/postService';
import 'leaflet/dist/leaflet.css';


const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerReload, setTriggerReload] = useState<() => void | null>(() => null);

  const handlePostSubmit = async (formData: any) => {
    try {
      createPost(formData);

      if (typeof triggerReload === 'function') {
        triggerReload();
      } else {
        console.error('PostList has not mounted or triggerReload is not set');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Post Manager</h1>
          <Taskbar />
        </header>
        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                <div className="post-actions">
                  <h2>Posts</h2>
                  <button className="create-post-button" onClick={() => setIsModalOpen(true)}>
                    Create New Post
                  </button>
                  <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <PostForm onSubmit={handlePostSubmit} onClose={() => setIsModalOpen(false)}/>
                  </Modal>
                </div>
                <PostList setTriggerReload={setTriggerReload} />
                </div>
              }
            />
            <Route path="/map" element={
              <MapWithForm />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
