// src/components/posts/PostForm.tsx
import { useState } from 'react';
import { PostFormData } from './types';
import { createPost, updatePost } from '../../services/postService';

interface PostFormProps {
  initialData?: PostFormData;
  postId?: string;
  onSubmitSuccess: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ initialData, postId, onSubmitSuccess }) => {
  const [formData, setFormData] = useState<PostFormData>(initialData || {
    title: '',
    description: '',
    image: '',
    longitude: '',
    latitude: '',
    tags: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // src/components/posts/PostForm.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Create the structure expected by the API
  const postData = {
    title: formData.title,  // Maps directly to title
    content: {
      description: formData.description,  // From form input
      image: formData.image  // From form input
    },
    location: {
      type: 'Point',  // Assuming this is always 'Point'
      coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]  // Converts to number
    },
    tags: formData.tags.split(',').map(tag => tag.trim())  // Converts comma-separated string to array
  };

  if (postId) {
    await updatePost(postId, postData);  // Update existing post
  } else {
    await createPost(postData);  // Create new post
  }

  onSubmitSuccess();
};

  return (
    <form onSubmit={handleSubmit}>
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
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="longitude"
        placeholder="Longitude"
        value={formData.longitude}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="latitude"
        placeholder="Latitude"
        value={formData.latitude}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma-separated)"
        value={formData.tags}
        onChange={handleChange}
        required
      />
      <button type="submit">{postId ? 'Update Post' : 'Create Post'}</button>
    </form>
  );
};

export default PostForm;
