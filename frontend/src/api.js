// src/api.js
import axios from 'axios';

const API_URL = 'https://crc-climate-stories-prototype.onrender.com'; // Adjust based on your Flask server URL

export const getPosts = async (tags) => {
    const response = await axios.get(`${API_URL}/posts`, { params: { tags } });
    return response.data;
};

export const createPost = async (post) => {
    const response = await axios.post(`${API_URL}/posts/create`, post);
    return response.data;
};

export const updatePost = async (id, post) => {
    const response = await axios.put(`${API_URL}/posts/update/${id}`, post);
    return response.data;
};

export const deletePost = async (id) => {
    const response = await axios.delete(`${API_URL}/posts/delete/${id}`);
    return response.data;
};
