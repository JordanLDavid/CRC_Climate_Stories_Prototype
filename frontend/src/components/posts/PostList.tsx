// src/components/posts/PostList.tsx
import { useEffect, useState } from 'react';
import { Post } from './types';
import { fetchPosts, deletePost } from '../../services/postService';

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const loadPosts = async () => {
    const data = await fetchPosts();
    setPosts(data);
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
    loadPosts();
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <h3>{post.title}</h3>
              <p>{post.content.description}</p>
              {post.content.image && (
                <img 
                  src={post.content.image} 
                  alt={post.title} 
                  style={{ width: '200px', height: 'auto' }} 
                />
              )}
              <p>{post.tags.join(', ')}</p>
              <button onClick={() => handleDelete(post._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default PostList;
