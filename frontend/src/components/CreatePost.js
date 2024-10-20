// src/components/CreatePost.js
import React, { useState } from 'react';
import { createPost } from '../api';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [location, setLocation] = useState({});
    const [tags, setTags] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            title,
            content: { text: content }, // Adjust based on your content structure
            location,
            tags: tags.split(',').map(tag => tag.trim()),
        };
        await createPost(postData);
        // Optionally reset the form or handle success
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" required />
            <input value={JSON.stringify(location)} onChange={e => setLocation(JSON.parse(e.target.value))} placeholder="Location" required />
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" />
            <button type="submit">Create Post</button>
        </form>
    );
};

export default CreatePost;
