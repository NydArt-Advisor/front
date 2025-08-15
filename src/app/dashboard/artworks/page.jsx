'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/UI/DashboardHeader';
import ArtworkList from '@/components/artwork/ArtworkList';

export default function ArtworksPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        fetchArtworks();
    }, [isAuthenticated, router]);

    const fetchArtworks = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/artworks/user`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch artworks');
            }

            const data = await response.json();
            // The database service returns an array directly, not wrapped in an artworks property
            setArtworks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching artworks:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (artwork) => {
        if (!confirm('Are you sure you want to delete this artwork?')) {
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/artworks/${artwork.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete artwork');
            }

            setArtworks(artworks.filter(a => a.id !== artwork.id));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="My Artworks"
                description="Manage your artwork collection"
            />

            <ArtworkList
                artworks={artworks}
                onDelete={handleDelete}
                loading={loading}
                error={error}
            />
        </div>
    );
} 