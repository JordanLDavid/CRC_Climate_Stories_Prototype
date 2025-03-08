// InformationPopup.tsx
import React from 'react';
import Modal from './common/Modal';
import './InformationPopup.css';

// Define types for our popup content sections
export type ContentSection = 'about' | 'contact' | 'faq';

interface InformationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: ContentSection;
  onSectionChange: (section: ContentSection) => void;
}

const InformationPopup: React.FC<InformationPopupProps> = ({ 
  isOpen, 
  onClose, 
  activeSection, 
  onSectionChange 
}) => {

  // Function to render the appropriate content based on activeSection
  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div className="popup-content-section">
            <h2>About Us</h2>
            <p>
              Climate Stories is a platform dedicated to sharing personal experiences 
              related to climate change from around the world. Our mission is to raise 
              awareness about climate change impacts through first-hand accounts.
            </p>
            <p>
              Founded in 2023, we aim to connect people through their stories and 
              foster a community that understands the real-world impacts of climate change.
            </p>
          </div>
        );
      case 'contact':
        return (
          <div className="popup-content-section">
            <h2>Contact Information</h2>
            <p>Have questions or feedback? Reach out to us!</p>
            <ul className="contact-list">
              <li><strong>Email:</strong> contact@climatestories.org</li>
              <li><strong>Phone:</strong> (555) 123-4567</li>
              <li><strong>Address:</strong> 123 Climate Lane, Earth City, 98765</li>
            </ul>
            <p>We typically respond within 2 business days.</p>
          </div>
        );
      case 'faq':
        return (
          <div className="popup-content-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-item">
              <h3>How do I share my own climate story?</h3>
              <p>Click on the "Add Story" button on the map and fill out the form with your experience.</p>
            </div>
            <div className="faq-item">
              <h3>Are the stories verified?</h3>
              <p>We do basic moderation, but stories represent personal experiences and perspectives.</p>
            </div>
            <div className="faq-item">
              <h3>Can I update my story after posting?</h3>
              <p>Yes, you can edit your submissions by logging into your account.</p>
            </div>
          </div>
        );
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="information-popup">
        <div className="popup-navigation">
          <button 
            className={`nav-button ${activeSection === 'about' ? 'active' : ''}`}
            onClick={() => onSectionChange('about')}
          >
            About Us
          </button>
          <button 
            className={`nav-button ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => onSectionChange('contact')}
          >
            Contact Info
          </button>
          <button 
            className={`nav-button ${activeSection === 'faq' ? 'active' : ''}`}
            onClick={() => onSectionChange('faq')}
          >
            FAQs
          </button>
        </div>
        
        {renderContent()}
        
        <div className="popup-footer">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InformationPopup;