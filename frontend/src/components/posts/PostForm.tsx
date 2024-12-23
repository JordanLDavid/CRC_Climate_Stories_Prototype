import React, { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { PostFormData } from './types';
import './PostForm.css';

interface PostFormProps {
  onSubmit: (formData: PostFormData) => void;
  onClose: () => void;
  initialCoordinates?: [number, number];
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, onClose, initialCoordinates = [0, 0] }) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: { description: '' },
    location: { type: 'Point', coordinates: initialCoordinates },
    tags: [],
    captchaToken: '',
  });

  React.useEffect(() => {
    if (
      formData.location.coordinates[0] !== initialCoordinates[0] ||
      formData.location.coordinates[1] !== initialCoordinates[1]
    ) {
      setFormData(prevData => ({
        ...prevData,
        location: { ...prevData.location, coordinates: initialCoordinates },
      }));
    }
  }, [initialCoordinates]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updateNestedField = (fieldPath: (string | number)[], value: any) => {
      setFormData(prevData => {
        const updatedData = { ...prevData };
        let currentLevel: any = updatedData;
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
        updateNestedField(['location', 'coordinates', 0], value === '' ? 0 : parseFloat(value) || 0);
        break;
      case 'latitude':
        updateNestedField(['location', 'coordinates', 1], value === '' ? 0 : parseFloat(value) || 0);
        break;
      case 'tags':
        setFormData(prevData => ({
          ...prevData,
          tags: value.split(',').map(tag => tag.trim()),
        }));
        break;
      default:
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.captchaToken) {
      onSubmit(formData);
      onClose();
    } else {
      alert('Please complete the hCaptcha.');
    }
  };

  const handleVerificationSuccess = (token: string) => {
    setFormData(prevData => ({
      ...prevData,
      captchaToken: token,
    }));
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

      <HCaptcha
        sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
        onVerify={handleVerificationSuccess}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export default PostForm;
