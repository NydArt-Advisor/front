'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import DashboardHeader from '@/components/UI/DashboardHeader';
import ArtworkForm from '@/components/artwork/ArtworkForm';

export default function EditArtworkPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async (formData) => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            let imageUrl = artwork.imageUrl;

            // If a new image was uploaded, upload it first
            if (formData.get('image')) {
                const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/api/ai/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });

                if (!imageResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                const imageData = await imageResponse.json();
                imageUrl = imageData.imageUrl;
            }

            const artworkData = JSON.parse(formData.get('data'));

            // Update artwork
            const artworkResponse = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/artworks/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...artworkData,
                    imageUrl
                })
            });

            if (!artworkResponse.ok) {
                throw new Error('Failed to update artwork');
            }

            router.push(`/dashboard/artworks/${params.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
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
                title={`Edit ${artwork.title}`}
                description="Update your artwork details"
            />

            {error && (
                <div className="bg-red-50/80 border border-red-200/60 rounded-2xl p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                <ArtworkForm
                    artwork={artwork}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
} 