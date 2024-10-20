// src/components/UpdatePost.js
import React, { useState } from 'react';
import { updatePost } from '../api';

const UpdatePost = ({ post, setPosts }) => {
    const [updatedContent, setUpdatedContent] = useState(post.content.text);

    const handleUpdate = async () => {
        const updatedPostData = {
            ...post,
            content: { text: updatedContent },
        };
        await updatePost(post._id, updatedPostData);
        setPosts(prev => prev.map(p => (p._id === post._id ? updatedPostData : p))); // Update local state
    };

    return (
        <div>
            <input 
                type="text" 
                value={updatedContent} 
                onChange={(e) => setUpdatedContent(e.target.value)} 
            />
            <button onClick={handleUpdate}>Update</button>
        </div>
    );
};

export default UpdatePost;
