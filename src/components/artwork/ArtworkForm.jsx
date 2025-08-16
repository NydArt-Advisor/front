'use client';

import { useState, useCallback } from 'react';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ArtworkForm({ artwork, onSubmit, isSubmitting }) {
    const [formData, setFormData] = useState({
        title: artwork?.title || '',
        description: artwork?.description || '',
        status: artwork?.status || 'published',
        isPublic: artwork?.isPublic ?? true,
        metadata: {
            size: artwork?.metadata?.size || 'medium',
            medium: artwork?.metadata?.medium || 'digital',
            style: artwork?.metadata?.style || 'other',
            dimensions: {
                width: artwork?.metadata?.dimensions?.width || '',
                height: artwork?.metadata?.dimensions?.height || '',
                unit: artwork?.metadata?.dimensions?.unit || 'px'
            }
        },
        tags: artwork?.tags?.join(', ') || ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(artwork?.imageUrl || null);

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    }, []);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        const form = new FormData();
        if (selectedFile) {
            form.append('image', selectedFile);
        }

        // Convert tags string to array
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

        // Prepare the data
        const data = {
            ...formData,
            tags,
            metadata: {
                ...formData.metadata,
                dimensions: {
                    ...formData.metadata.dimensions,
                    width: Number(formData.metadata.dimensions.width) || null,
                    height: Number(formData.metadata.dimensions.height) || null
                }
            }
        };

        // Append JSON data
        form.append('data', JSON.stringify(data));

        onSubmit(form);
    }, [formData, selectedFile, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                    Artwork Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-text/10 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                        {previewUrl ? (
                            <div className="relative">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="mx-auto h-64 w-auto rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewUrl(null);
                                        setSelectedFile(null);
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <FaUpload className="mx-auto h-12 w-12 text-text/40" />
                                <div className="flex text-sm text-text/60">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md font-medium text-primary-coral hover:text-primary-salmon"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-text/60">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-text">
                    Title
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-lg border border-text/10 bg-background shadow-sm focus:border-primary-coral focus:ring-primary-coral sm:text-sm px-4 py-2"
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-text">
                    Description
                </label>
                <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-lg border border-text/10 bg-background shadow-sm focus:border-primary-coral focus:ring-primary-coral sm:text-sm px-4 py-2"
                />
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Size */}
                <div>
                    <label htmlFor="metadata.size" className="block text-sm font-medium text-text">
                        Size
                    </label>
                    <select
                        name="metadata.size"
                        id="metadata.size"
                        value={formData.metadata.size}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-text/10 bg-background shadow-sm focus:border-primary-coral focus:ring-primary-coral sm:text-sm px-4 py-2"
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>

                {/* Medium */}
                <div>
                    <label htmlFor="metadata.medium" className="block text-sm font-medium text-text">
                        Medium
                    </label>
                    <select
                        name="metadata.medium"
                        id="metadata.medium"
                        value={formData.metadata.medium}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-text/10 bg-background shadow-sm focus:border-primary-coral focus:ring-primary-coral sm:text-sm px-4 py-2"
                    >
                        <option value="digital">Digital</option>
                        <option value="oil">Oil</option>
                        <option value="acrylic">Acrylic</option>
                        <option value="watercolor">Watercolor</option>
                        <option value="pencil">Pencil</option>
                        <option value="charcoal">Charcoal</option>
                        <option value="mixed-media">Mixed Media</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Style */}
                <div>
                    <label htmlFor="metadata.style" className="block text-sm font-medium text-text">
                        Style
                    </label>
                    <select
                        name="metadata.style"
                        id="metadata.style"
                        value={formData.metadata.style}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-text/10 bg-background shadow-sm focus:border-primary-coral focus:ring-primary-coral sm:text-sm px-4 py-2"
                    >
                        <option value="realistic">Realistic</option>
                        <option value="abstract">Abstract</option>
                        <option value="impressionistic">Impressionistic</option>
                        <option value="surrealistic">Surrealistic</option>
                        <option value="minimalistic">Minimalistic</option>
                        <option value="pop-art">Pop Art</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-text">
                        Status
                    </label>
                    <select
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-text/10 bg-background shadow-sm focus:border-primary-coral focus:ring-primary-coral sm:text-sm px-4 py-2"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label htmlFor="metadata.dimensions.width" className="block text-sm font-medium text-text">
                        Width
                    </label>
                    <input
                        type="number"
                        name="metadata.dimensions.width"
                        id="metadata.dimensions.width"
                        value={formData.metadata.dimensions.width}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-text/10 bg-background shadow-sm focus:border-primary-coral focus:ring-primary-coral sm:text-sm px-4 py-2"
                    />
                </div>
                <div>
                    <label htmlFor="metadata.dimensions.height" className="block text-sm font-medium text-text">
                        Height
                    </label>
                    <input
                        type="number"
                        name="metadata.dimensions.height"
                        id="metadata.dimensions.height"
                        value={formData.metadata.dimensions.height}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-text/10 bg-background shadow-sm focus:border-primary-coral focus:ring-primary-coral sm:text-sm px-4 py-2"
                    />
                </div>
                <div>
                    <label htmlFor="metadata.dimensions.unit" className="block text-sm font-medium text-text">
                        Unit
                    </label>
                    <select
                        name="metadata.dimensions.unit"
                        id="metadata.dimensions.unit"
                        value={formData.metadata.dimensions.unit}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-text/10 bg-background shadow-sm focus:border-primary-coral focus:ring-primary-coral sm:text-sm px-4 py-2"
                    >
                        <option value="px">Pixels</option>
                        <option value="cm">Centimeters</option>
                        <option value="in">Inches</option>
                    </select>
                </div>
            </div>

            {/* Tags */}
            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-text">
                    Tags
                </label>
                <input
                    type="text"
                    name="tags"
                    id="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Enter tags separated by commas"
                    className="mt-1 block w-full rounded-lg border border-text/10 bg-background shadow-sm focus:border-primary-coral focus:ring-primary-coral sm:text-sm px-4 py-2"
                />
            </div>

            {/* Visibility */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    name="isPublic"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-coral focus:ring-primary-coral border-text/10 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-text">
                    Make this artwork public
                </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2
                        ${isSubmitting
                            ? 'bg-primary-coral/75 cursor-not-allowed'
                            : 'bg-primary-coral hover:bg-primary-salmon hover:shadow-lg transform hover:-translate-y-0.5'
                        } 
                        text-white relative overflow-hidden`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <FaUpload />
                            <span>{artwork ? 'Update Artwork' : 'Create Artwork'}</span>
                        </>
                    )}
                </motion.button>
            </div>
        </form>
    );
} 