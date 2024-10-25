// src/components/posts/PostForm.tsx
import React, { useState } from 'react';
import { PostFormData } from './types';
import './PostForm.css'; // Import the CSS file

interface PostFormProps {
  onSubmit: (formData: PostFormData) => void;
  onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: {
      description: '',
      image: '', 
    },
    location: {
      type: 'Point', 
      coordinates: [0, 0], 
    },
    tags: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const updateNestedField = (fieldPath: (string | number)[], value: any) => {
      setFormData(prevData => {
        const updatedData = { ...prevData };
        let currentLevel: any = updatedData;

        // Navigate to the correct level in the nested object
        for (let i = 0; i < fieldPath.length - 1; i++) {
          currentLevel = currentLevel[fieldPath[i]] as any;
        }
        currentLevel[fieldPath[fieldPath.length - 1]] = value;
        return updatedData;
      });
    };

    switch (name) {
      case 'description':
        updateNestedField(['content', 'description'], value);
        break;
      case 'image':
        updateNestedField(['content', 'image'], value);
        break;
        case 'longitude':
          updateNestedField(
            ['location', 'coordinates', 0],
            value === '' ? 0 : parseFloat(value) || 0 // Prevent NaN or empty values
          );
          break;
        case 'latitude':
          updateNestedField(
            ['location', 'coordinates', 1],
            value === '' ? 0 : parseFloat(value) || 0 // Prevent NaN or empty values
          );
        break;
      case 'tags':
        setFormData(prevData => ({
          ...prevData,
          tags: value.split(',').map(tag => tag.trim()), // Update tags
        }));
        break;
      default:
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // Close the modal after submitting
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.content.description}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={formData.content.image}
        onChange={handleChange}
      />
      <input
        type="text"
        name="longitude"
        placeholder="Longitude"
        value={formData.location.coordinates[0]}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="latitude"
        placeholder="Latitude"
        value={formData.location.coordinates[1]}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma separated)"
        value={formData.tags}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PostForm;
