'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaEdit, FaTrash, FaEye, FaHeart, FaCalendar, FaRuler, FaPalette, FaTags } from 'react-icons/fa';
import Modal from '@/components/UI/Modal';

export default function ArtworkDetail({ artwork, onDelete }) {
    const router = useRouter();
    const [deleteModal, setDeleteModal] = useState(false);

    const handleEdit = () => {
        router.push(`/dashboard/artworks/${artwork.id}/edit`);
    };

    const handleDelete = () => {
        setDeleteModal(true);
    };

    const confirmDelete = async () => {
        await onDelete(artwork);
        router.push('/dashboard/artworks');
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => router.push('/dashboard/artworks')}
                    className="px-4 py-2 bg-background-alt text-text rounded-lg hover:bg-background-hover transition-colors flex items-center gap-2"
                >
                    <FaArrowLeft />
                    Back
                </button>
                <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-background-alt text-text rounded-lg hover:bg-background-hover transition-colors flex items-center gap-2"
                >
                    <FaEdit />
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                    <FaTrash />
                    Delete
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Artwork Image */}
                <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-text">Artwork</h2>
                        <div className="relative">
                            <img
                                src={artwork.imageUrl}
                                alt={artwork.title}
                                className="w-full h-96 object-cover rounded-lg"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div
                                className="w-full h-96 bg-primary-coral/10 rounded-lg flex items-center justify-center"
                                style={{ display: 'none' }}
                            >
                                <FaPalette className="text-primary-coral text-3xl" />
                            </div>
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${artwork.status === 'published' ? 'bg-green-100 text-green-800' :
                                    artwork.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {artwork.status.charAt(0).toUpperCase() + artwork.status.slice(1)}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-text">{artwork.title}</h3>
                            <p className="text-text/60">{artwork.description}</p>
                            <div className="flex items-center gap-4 text-sm text-text/60">
                                <span className="flex items-center gap-1">
                                    <FaCalendar />
                                    {new Date(artwork.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaEye />
                                    {artwork.views} views
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaHeart />
                                    {artwork.likes} likes
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Artwork Details */}
                <div className="space-y-6">
                    {/* Metadata */}
                    <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                        <h3 className="text-lg font-semibold text-text mb-4">Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <FaPalette className="text-text/60" />
                                <div>
                                    <p className="text-sm font-medium text-text">Medium</p>
                                    <p className="text-sm text-text/60">{artwork.metadata.medium}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaPalette className="text-text/60" />
                                <div>
                                    <p className="text-sm font-medium text-text">Style</p>
                                    <p className="text-sm text-text/60">{artwork.metadata.style}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaRuler className="text-text/60" />
                                <div>
                                    <p className="text-sm font-medium text-text">Dimensions</p>
                                    <p className="text-sm text-text/60">
                                        {artwork.metadata.dimensions.width} × {artwork.metadata.dimensions.height} {artwork.metadata.dimensions.unit}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaTags className="text-text/60" />
                                <div>
                                    <p className="text-sm font-medium text-text">Tags</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {artwork.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-background rounded-lg text-xs text-text/60"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
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
                        Are you sure you want to delete "{artwork.title}"?
                        This action cannot be undone.
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => setDeleteModal(false)}
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