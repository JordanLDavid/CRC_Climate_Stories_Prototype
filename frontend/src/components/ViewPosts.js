// src/components/ViewPosts.js
import React, { useEffect, useState } from 'react';
import { getPosts, deletePost } from '../api';
import UpdatePost from './UpdatePost'; // Import update component

const ViewPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const data = await getPosts(); // Fetch posts
            setPosts(data);
        };
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        await deletePost(id); // Implement deletePost API call
        setPosts(posts.filter(post => post.id !== id)); // Update local state
    };

    return (
        <div>
            <h2>Posts</h2>
            {posts.map((post) => (
                <div key={post._id}>
                    <h3>{post.title}</h3>
                    <p>{post.content.description}</p>
                    <div>
                        <strong>Tags:</strong>
                        <ul>
                            {post.tags.map((tag, index) => (
                                <li key={index}>{tag}</li>
                            ))}
                        </ul>
                    </div>
                    {/*<button onClick={() => handleDelete(post._id)}>Delete</button>*/}
                    {/*<UpdatePost post={post} setPosts={setPosts} /> {/* Pass post for updating */}
                </div>
            ))}
        </div>
    );
};

export default ViewPosts;
