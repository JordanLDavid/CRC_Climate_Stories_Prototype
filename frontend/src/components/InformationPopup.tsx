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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet dapibus urna. 
            Curabitur ullamcorper magna eu mi venenatis, sit amet tincidunt purus dapibus. 
            Maecenas viverra rutrum turpis, vitae lacinia orci. Sed elementum, metus eleifend 
            rutrum efficitur, dui velit aliquam risus, et pellentesque ligula nulla quis velit. 
            Morbi in nisi ut tortor varius varius ac feugiat nibh. Nulla ante velit, egestas 
            vitae efficitur ut, congue id quam. Nam quis diam eu neque faucibus volutpat. Integer 
            consectetur ligula sed tellus accumsan, in sagittis justo vestibulum. Curabitur 
            vulputate purus id volutpat tempor. Sed tellus erat, cursus ac arcu quis, imperdiet 
            cursus est.
            </p>
            <p>
            Etiam finibus leo vel neque mollis efficitur. Vestibulum ac odio et nulla efficitur 
            suscipit. Sed gravida gravida sollicitudin. Aliquam mollis diam in dui hendrerit, 
            quis tristique urna maximus. Curabitur vestibulum nunc tortor, et gravida neque 
            vulputate vitae. Sed condimentum vulputate elit, non fermentum dui commodo at. Proin 
            maximus commodo magna a laoreet.
            </p>
          </div>
        );
      case 'contact':
        return (
          <div className="popup-content-section">
            <h2>Contact Information</h2>
            <p>Have questions or feedback? Reach out to us!</p>
            <ul className="contact-list">
              <li><strong>Email:</strong> test@email.com</li>
              <li><strong>Phone:</strong> (555) 123-4567</li>
              <li><strong>Address:</strong> Toronto</li>
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
              <p>Click a location in the map and fill out the form with your experience.</p>
            </div>
            <div className="faq-item">
              <h3>Are the stories verified?</h3>
              <p>We do basic moderation, but stories represent personal experiences and perspectives.</p>
            </div>
            <div className="faq-item">
              <h3>Can I have my story deleted?</h3>
              <p>Yes, just send us an e-mail</p>
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