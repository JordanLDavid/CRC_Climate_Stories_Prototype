import React, { useState } from 'react';
import Map from './Map';
import PostForm from './posts/PostForm';
import './MapWithForm.css';
import Modal from './common/Modal';
import { Post } from './posts/types';

interface MapWithFormProps {
  posts: Post[];
  onPostSubmit: (formData: any) => void;
}

const MapWithForm: React.FC<MapWithFormProps> = ({ posts, onPostSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(undefined);

  const handleMapClick = (coords: [number, number]) => {
    setCoordinates(coords);
    setIsModalOpen(true);
  };

  const handleFormSubmit = () => {
    // Process form data here
    setIsModalOpen(false);
  };

  return (  
    <div className="map-container">
      <Map onMapClick={handleMapClick} posts={posts}  />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <PostForm onSubmit={onPostSubmit} onClose={() => setIsModalOpen(false)} initialCoordinates={coordinates}/>
      </Modal>
    </div>
  );
};

export default MapWithForm;
