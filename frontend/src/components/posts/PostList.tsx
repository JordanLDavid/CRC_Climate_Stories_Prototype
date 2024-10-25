// src/components/posts/PostList.tsx
import { useEffect, useState } from 'react';
import { Post } from './types';
import { fetchPosts, deletePost } from '../../services/postService';
import './PostList.css';

interface PostListProps {
  setTriggerReload: (reloadFunc: () => void) => void;
}

const PostList: React.FC<PostListProps> = ({ setTriggerReload }) => {
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
    // Load posts when component mounts
    // Pass the loadPost function to App.tsx to allow reloading
    setTriggerReload(loadPosts);
  }, [setTriggerReload]);

  return (
      <div className="post-list-container">
        {posts.length > 0 ? (
          <div className="post-list">
            <div className="post-list-header">
              <span>Title</span>
              <span>Description</span>
              <span>Image</span>
              <span>Longitude</span>
              <span>Latitude</span>
              <span>Tags</span>
            </div>
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
                </div>
              ))}
            </div>
          </div>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default PostList;
