// src/components/posts/PostList.tsx
import { Post } from './types';
import './PostList.css';

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
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
