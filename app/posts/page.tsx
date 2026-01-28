'use client';

import { useEffect, useState } from 'react';
import CardList from '../components/Posts/CardList';

interface Iposts {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}

const Posts = () => {
    const [posts, setPosts] = useState<Iposts[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts', {
                cache: 'no-store'
            });
            const data = await response.json();
            // Handle response dengan format { Data: [...] }
            setPosts(Array.isArray(data) ? data : (data.Data || []));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch pertama kali
        fetchPosts();

        // Auto refresh setiap 5 detik
        const interval = setInterval(() => {
            fetchPosts();
        }, 5000);

        // Cleanup interval saat component unmount
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl">Loading posts...</p>
            </div>
        );
    }

    return (
        <>
        <div className="mb-4">
            <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
            </p>
            {/* <button 
                onClick={fetchPosts}
                className="mt-2 px-4 py-2 bg-fuchsia-500 text-white rounded hover:bg-fuchsia-600"
            >
                Refresh Now
            </button> */}
        </div>

        <h1 className="text-fuchsia-500 mb-6">Posts Page</h1>
        
        {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet. Create your first post!</p>
        ) : (
            <CardList>
                {posts.map((post) => {
                    return (          
                        <div key={post._id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">{post.title}</div>
                                <p className="text-gray-700 text-base">
                                    {post.content}
                                </p>
                                <p className="text-gray-500 text-sm mt-2">By: {post.author}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </CardList>
        )}
        </>
    );
};

export default Posts;