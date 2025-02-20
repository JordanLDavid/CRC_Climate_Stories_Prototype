// App.tsx
import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MapWithForm from './components/MapWithForm';
import Taskbar from './components/Taskbar';
import { createPost, fetchPosts } from './services/postService';
import { Post } from './components/posts/types';
import 'leaflet/dist/leaflet.css';
import Home from './components/Home';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const loadPosts = useCallback(async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);
    
  const handlePostSubmit = async (formData: any) => {
    try {
      await createPost(formData);
      loadPosts(); // Reload posts after a new post is created
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Router>
      <div className="app-container">
          <Taskbar />
        <main className="app-main">
          <Routes>
            <Route
              path="/posts"
              element={
                <Home
                  posts={posts}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  onPostSubmit={handlePostSubmit}
                />
              }
            />
            <Route path="/" element={<MapWithForm posts={posts} onPostSubmit={handlePostSubmit}/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
