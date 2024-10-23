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
    description: string;
    image: string;
    longitude: string;
    latitude: string;
    tags: string;
  }
  