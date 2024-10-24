// src/components/posts/PostList.tsx
import { useEffect, useState } from 'react';
import { Post } from './types';
import { fetchPosts, deletePost } from '../../services/postService';
import './PostList.css'; // Import CSS file

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
    <div className="post-list-container">
      <h2>Posts</h2>
      {posts.length > 0 ? (
        <div className="post-list">
          {posts.map((post) => (
            <div className="post-item" key={post._id}>
              <div className="post-title">{post.title}</div>
              <div className="post-description">{post.content.description}</div>
              <div className="post-image">
                {post.content.image && (
                  <img
                    src={post.content.image}
                    alt={post.title}
                  />
                )}
              </div>
              <div className="post-longitude">{post.location.coordinates[0]}</div>
              <div className="post-latitude">{post.location.coordinates[1]}</div>
              <div className="post-tags">{post.tags.join(', ')}</div>
              <div className="post-delete">
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default PostList;
