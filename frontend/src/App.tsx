// src/App.tsx
import { useState } from 'react';
import './App.css';
import Modal from './components/common/Modal';
import PostForm from './components/posts/PostForm';
import PostList from './components/posts/PostList';
import { createPost } from './services/postService';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerReload, setTriggerReload] = useState<() => void | null>(() => null);

  const handlePostSubmit = async (formData: any) => {
    // Call the API to create a new post
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
    <div className="app-container">
      <header className="app-header">
        <h1>Post Manager</h1>
      </header>
      <main className="app-main">
        <div className="post-actions">
          <h2>Posts</h2>
          <button className="create-post-button" onClick={() => setIsModalOpen(true)}>Create New Post</button>
          
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <PostForm onSubmit={handlePostSubmit} onClose={() => setIsModalOpen(false)} />
          </Modal>
        </div>
        <PostList setTriggerReload={setTriggerReload} />
      </main>
    </div>
  );
};

export default App;
