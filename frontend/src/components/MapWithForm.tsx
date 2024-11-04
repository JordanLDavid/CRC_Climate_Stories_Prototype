import React, { useState } from 'react';
import Map from './Map';
import PostForm from './posts/PostForm';
import { PostFormData } from './posts/types';
import './MapWithForm.css';
import Modal from './common/Modal';

const MapWithForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(undefined);

  const handleMapClick = (coords: [number, number], event: React.MouseEvent<HTMLDivElement>) => {
    setCoordinates(coords);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData: PostFormData) => {
    // Process form data here
    setIsModalOpen(false);
  };

  return (  
    <div className="map-container">
      <Map onMapClick={handleMapClick} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <PostForm onSubmit={handleFormSubmit} onClose={() => setIsModalOpen(false)} initialCoordinates={coordinates}/>
      </Modal>
    </div>
  );
};

export default MapWithForm;
