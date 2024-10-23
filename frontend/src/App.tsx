// src/App.tsx
import { useState } from 'react';
import PostList from './components/posts/PostList';
import PostForm from './components/posts/PostForm';

const App: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      <h1>Post Manager</h1>
      <button onClick={toggleForm}>
        {showForm ? 'Hide Form' : 'Create New Post'}
      </button>
      {showForm && <PostForm onSubmitSuccess={() => setShowForm(false)} />}
      <PostList />
    </div>
  );
};

export default App;
