'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import DashboardHeader from '@/components/UI/DashboardHeader';
import ArtworkDetail from '@/components/artwork/ArtworkDetail';

export default function ArtworkDetailPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        fetchArtwork();
    }, [isAuthenticated, router, params.id]);

    const fetchArtwork = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/artworks/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch artwork');
            }

            const data = await response.json();
            setArtwork(data);
        } catch (error) {
            console.error('Error fetching artwork:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
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

            router.push('/dashboard/artworks');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-50/80 border border-red-200/60 rounded-2xl p-8 max-w-md mx-auto">
                    <h2 className="text-xl font-semibold text-red-800 mb-4">Error Loading Artwork</h2>
                    <p className="text-red-700 mb-4">{error}</p>
                </div>
            </div>
        );
    }

    if (!artwork) {
        return (
            <div className="text-center py-12">
                <div className="bg-yellow-50/80 border border-yellow-200/60 rounded-2xl p-8 max-w-md mx-auto">
                    <h2 className="text-xl font-semibold text-yellow-800 mb-4">Artwork Not Found</h2>
                    <p className="text-yellow-700 mb-4">The artwork you're looking for doesn't exist or has been deleted.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <DashboardHeader
                title={artwork.title}
                description="View and manage your artwork"
            />

            <ArtworkDetail
                artwork={artwork}
                onDelete={handleDelete}
            />
        </div>
    );
}