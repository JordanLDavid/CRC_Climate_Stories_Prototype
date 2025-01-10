import React, { useState } from 'react';
import MapComponent from './Map';
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

  return (  
    <div className="map-container">
      <MapComponent onMapClick={handleMapClick} posts={posts}  />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <PostForm onSubmit={onPostSubmit} onClose={() => setIsModalOpen(false)} initialCoordinates={coordinates}/>
      </Modal>
    </div>
  );
};

export default MapWithForm;
