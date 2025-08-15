'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/UI/DashboardHeader';
import ArtworkForm from '@/components/artwork/ArtworkForm';

export default function NewArtworkPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [prefilledArtwork, setPrefilledArtwork] = useState(null);

    // Check if coming from analysis
    const fromAnalysis = searchParams.get('fromAnalysis') === 'true';

    useEffect(() => {
        if (fromAnalysis) {
            const storedData = sessionStorage.getItem('artworkFromAnalysis');
            if (storedData) {
                try {
                    const data = JSON.parse(storedData);
                    setPrefilledArtwork(data);
                    // Clear the stored data
                    sessionStorage.removeItem('artworkFromAnalysis');
                } catch (err) {
                    console.error('Error parsing stored artwork data:', err);
                }
            }
        }
    }, [fromAnalysis]);

    const handleSubmit = async (formData) => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            // Upload image to AI service
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
            const imageUrl = imageData.imageUrl;

            // Create artwork in database
            const artworkResponse = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/artworks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...JSON.parse(formData.get('data')), // Assuming formData.get('data') contains the artwork details
                    imageUrl: imageUrl
                })
            });

            if (!artworkResponse.ok) {
                throw new Error('Failed to create artwork');
            }

            router.push('/dashboard/artworks');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <DashboardHeader
                title={fromAnalysis ? "Add Artwork from Analysis" : "New Artwork"}
                description={fromAnalysis ? "Save your analyzed artwork to your collection" : "Add a new artwork to your collection"}
            />

            {fromAnalysis && (
                <div className="bg-blue-50/80 border border-blue-200/60 rounded-2xl p-4">
                    <p className="text-blue-700 text-sm">
                        You're adding an artwork from your recent analysis. The image and details have been pre-filled for you.
                    </p>
                </div>
            )}

            {error && (
                <div className="bg-red-50/80 border border-red-200/60 rounded-2xl p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                <ArtworkForm
                    artwork={prefilledArtwork}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
} 