// CustomPopup.tsx
import React from 'react';
import './Popup.css';
import { Post } from './posts/types';

interface CustomPopupProps {
  post: Post;
}

const CustomPopup: React.FC<CustomPopupProps> = ({ post }) => (
  <>
    
  <div className="custom-popup">
    <h3 className="popup-title">{post.title}</h3>
    <p className="popup-description">{post.content.description}</p>
    <small className="popup-date">
      {new Date(post.created_at).toLocaleDateString()}
    </small>
    <div className="popup-tags">
      {post.tags.length > 0 && post.tags.map(tag => (
        <span key={tag} className="popup-tag">#{tag}</span>
      ))}
    </div>
  </div>
);

export default CustomPopup;
