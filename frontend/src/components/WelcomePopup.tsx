// WelcomePopup.tsx
import React from 'react';
import Modal from './common/Modal';
import './WelcomePopup.css';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="welcome-popup">
        <h2>Welcome to Climate Stories!</h2>
        <p>
          This is a platform where users can share their climate change experiences and stories.
          You can explore stories from around the world on our interactive map, read detailed
          accounts, and contribute your own climate story.
        </p>
        <p>
          Browse through posts, create your own stories, and join our community
          of climate-conscious individuals sharing their perspectives.
        </p>
        <button className="welcome-btn" onClick={onClose}>
          Get Started
        </button>
      </div>
    </Modal>
  );
};

export default WelcomePopup;