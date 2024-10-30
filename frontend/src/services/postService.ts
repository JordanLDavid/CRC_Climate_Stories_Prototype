import axios from 'axios';
import { Post, PostFormData } from '../components/posts/types';

const API_URL = 'https://crc-climate-stories-prototype.onrender.com/posts'; // Replace with your backend URL

// Fetch all posts
export const fetchPosts = async (): Promise<Post[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Fetch a single post by ID
export const fetchPostById = async (id: string): Promise<Post> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create a new post
export const createPost = async (postData: PostFormData): Promise<Post> => {
  const response = await axios.post(`${API_URL}/create`, postData);
  return response.data;
};

// Update an existing post
export const updatePost = async (id: string, postData: PostFormData): Promise<Post> => {
  const response = await axios.put(`${API_URL}/update/${id}`, postData);
  return response.data;
};

// Delete a post
export const deletePost = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/delete/${id}`);
};
