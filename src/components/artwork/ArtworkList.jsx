'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPalette, FaPlus } from 'react-icons/fa';
import ArtworkCard from './ArtworkCard';
import Modal from '@/components/UI/Modal';

export default function ArtworkList({ artworks, onDelete, loading, error }) {
    const router = useRouter();
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, artwork: null });

    const handleViewArtwork = (artwork) => {
        router.push(`/dashboard/artworks/${artwork.id}`);
    };

    const handleEditArtwork = (artwork) => {
        router.push(`/dashboard/artworks/${artwork.id}/edit`);
    };

    const handleAnalyzeArtwork = (artwork) => {
        // Navigate to analyze page with the artwork image pre-loaded
        router.push(`/analyze?artworkId=${artwork.id}&imageUrl=${encodeURIComponent(artwork.imageUrl)}`);
    };

    const handleDeleteClick = (artwork) => {
        setDeleteModal({ isOpen: true, artwork });
    };

    const confirmDelete = async () => {
        if (!deleteModal.artwork) return;
        await onDelete(deleteModal.artwork);
        setDeleteModal({ isOpen: false, artwork: null });
    };

    const cancelDelete = () => {
        setDeleteModal({ isOpen: false, artwork: null });
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
                    <h2 className="text-xl font-semibold text-red-800 mb-4">Error Loading Artworks</h2>
                    <p className="text-red-700 mb-4">{error}</p>
                </div>
            </div>
        );
    }

    if (!artworks?.length) {
        return (
            <div className="text-center py-12">
                <FaPalette className="mx-auto text-4xl text-text/40 mb-4" />
                <h3 className="text-lg font-medium text-text mb-2">No artworks found</h3>
                <p className="text-text/60 mb-6">
                    Start by adding your first artwork!
                </p>
                <button
                    onClick={() => router.push('/dashboard/artworks/new')}
                    className="px-6 py-3 bg-primary-coral text-white rounded-lg hover:bg-primary-coral/90 transition-colors inline-flex items-center gap-2"
                >
                    <FaPlus />
                    Add Artwork
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Add New Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => router.push('/dashboard/artworks/new')}
                    className="px-6 py-3 bg-primary-coral text-white rounded-lg hover:bg-primary-coral/90 transition-colors inline-flex items-center gap-2"
                >
                    <FaPlus />
                    Add Artwork
                </button>
            </div>

            {/* Artworks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.map((artwork) => (
                    <ArtworkCard
                        key={artwork.id}
                        artwork={artwork}
                        onView={handleViewArtwork}
                        onEdit={handleEditArtwork}
                        onDelete={handleDeleteClick}
                        onAnalyze={handleAnalyzeArtwork}
                    />
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={cancelDelete}
                title="Delete Artwork"
                size="sm"
            >
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaPalette className="text-red-600 text-2xl" />
                    </div>

                    <h3 className="text-lg font-semibold text-text mb-2">
                        Delete Artwork?
                    </h3>

                    <p className="text-text/70 mb-6">
                        Are you sure you want to delete "{deleteModal.artwork?.title}"?
                        This action cannot be undone.
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={cancelDelete}
                            className="px-6 py-2 bg-background-alt text-text rounded-lg hover:bg-background-hover transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
} 