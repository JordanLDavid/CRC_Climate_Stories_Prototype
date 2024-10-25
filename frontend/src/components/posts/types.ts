// src/components/posts/types.ts
export interface Location {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  }
  
  export interface PostContent {
    description: string;
    image: string;
  }
  
  export interface Post {
    _id: string;
    title: string;
    content: PostContent;
    location: Location;
    tags: string[];
    created_at: string;
  }
  
  export interface PostFormData {
    title: string;
    content: {
      description: string;
      image: string;
    };
    location: {
      type: string;
      coordinates: [number, number]; // Ensure this is a tuple of numbers
    };
    tags: string[];
  }
  