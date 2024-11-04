import axios from 'axios';
import { Post, PostFormData } from '../components/posts/types';

const API_URL = import.meta.env.BACKEND_API_BASE_URL;

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const fetchPostById = async (id: string): Promise<Post> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createPost = async (postData: PostFormData): Promise<Post> => {
  const response = await axios.post(`${API_URL}/create`, postData);
  return response.data;
};

export const updatePost = async (id: string, postData: PostFormData): Promise<Post> => {
  const response = await axios.put(`${API_URL}/update/${id}`, postData);
  return response.data;
};


export const deletePost = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/delete/${id}`);
};
