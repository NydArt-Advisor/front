'use client';

import { FaPalette, FaEye, FaHeart, FaEdit, FaTrash, FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ArtworkCard({ artwork, onView, onEdit, onDelete, onAnalyze }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background-alt rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-text/5 hover:border-text/10"
        >
            {/* Artwork Image */}
            <div className="relative mb-4">
                <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                <div
                    className="w-full h-48 bg-primary-coral/10 rounded-lg flex items-center justify-center"
                    style={{ display: 'none' }}
                >
                    <FaPalette className="text-primary-coral text-3xl" />
                </div>
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${artwork.status === 'published' ? 'bg-green-100 text-green-800' :
                        artwork.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {artwork.status.charAt(0).toUpperCase() + artwork.status.slice(1)}
                    </span>
                </div>
            </div>

            {/* Artwork Info */}
            <div className="space-y-3">
                <div>
                    <h3 className="font-semibold text-text mb-1 truncate">
                        {artwork.title}
                    </h3>
                    <p className="text-sm text-text/60 line-clamp-2">
                        {artwork.description || 'No description provided'}
                    </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-text/60">
                    <span className="flex items-center gap-1">
                        <FaEye className="text-xs" />
                        {artwork.views}
                    </span>
                    <span className="flex items-center gap-1">
                        <FaHeart className="text-xs" />
                        {artwork.likes}
                    </span>
                    <span>
                        {artwork.metadata?.medium}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => onView(artwork)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-coral text-white text-sm rounded-lg hover:bg-primary-coral/90 transition-colors"
                    >
                        <FaEye />
                        View
                    </button>
                    <button
                        onClick={() => onAnalyze(artwork)}
                        className="px-3 py-2 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100 transition-colors"
                        title="Analyze with AI"
                    >
                        <FaBrain />
                    </button>
                    <button
                        onClick={() => onEdit(artwork)}
                        className="px-3 py-2 bg-background text-text text-sm rounded-lg hover:bg-background-hover transition-colors"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => onDelete(artwork)}
                        className="px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </motion.div>
    );
} 