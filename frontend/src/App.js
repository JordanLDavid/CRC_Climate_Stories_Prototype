// src/App.js
import React from 'react';
import CreatePost from './components/CreatePost';
import ViewPosts from './components/ViewPosts';

function App() {
    return (
        <div>
            <h1>Climate Posts</h1>
            {/*<CreatePost />*/}
            <ViewPosts /> {/* Display posts */}
        </div>
    );
}

export default App;
