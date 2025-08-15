import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

const analysisTypes = [
    {
        id: 'general',
        label: 'General Analysis',
        description: 'Comprehensive feedback'
    },
    {
        id: 'technique',
        label: 'Technical Focus',
        description: 'Brushwork & execution'
    },
    {
        id: 'composition',
        label: 'Composition',
        description: 'Balance & visual flow'
    },
    {
        id: 'color',
        label: 'Color Theory',
        description: 'Color usage & harmony'
    }
];

const ImageUpload = ({ onImageSelect, analysisType, onAnalysisTypeChange, isAnalyzed = false, preloadedImageUrl = null }) => {
    const [preview, setPreview] = useState(null);

    // Handle pre-loaded image from URL params
    useEffect(() => {
        if (preloadedImageUrl && !isAnalyzed) {
            setPreview(preloadedImageUrl);
            // Create a mock file object for the pre-loaded image
            const mockFile = new File([], 'artwork.jpg', { type: 'image/jpeg' });
            onImageSelect(mockFile);
        }
    }, [preloadedImageUrl, isAnalyzed, onImageSelect]);

    const onDrop = useCallback((acceptedFiles) => {
        if (isAnalyzed) return; // Prevent new uploads if already analyzed

        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onImageSelect(file);
            };
            reader.readAsDataURL(file);
        }
    }, [onImageSelect, isAnalyzed]);

    const removeImage = useCallback((e) => {
        if (e) {
            e.stopPropagation();
        }
        if (!isAnalyzed) {
            setPreview(null);
            onImageSelect(null);
        }
    }, [onImageSelect, isAnalyzed]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp']
        },
        maxFiles: 1,
        maxSize: 10485760, // 10MB
        disabled: isAnalyzed // Disable dropzone if already analyzed
    });

    return (
        <div className="space-y-6">
            {/* Analysis Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysisTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => onAnalysisTypeChange(type.id)}
                        className={`relative flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200
                            ${analysisType === type.id
                                ? 'border-primary-coral bg-primary-coral/10 text-primary-coral'
                                : 'border-gray-200 hover:border-primary-coral/50 hover:bg-primary-coral/5'}`}
                    >
                        <span className="font-medium text-sm">{type.label}</span>
                        <span className="text-xs text-gray-500 mt-1">{type.description}</span>
                        {analysisType === type.id && (
                            <div className="absolute top-2 right-2">
                                <svg className="w-4 h-4 text-primary-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Image Upload Area */}
            <div className="mt-6">
                <div
                    {...(!isAnalyzed ? getRootProps() : {})}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors relative
                        ${isDragActive && !isAnalyzed ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
                        ${preview ? 'bg-background-alt' : 'bg-background'}
                        ${isAnalyzed ? 'cursor-default' : 'cursor-pointer hover:border-gray-400'}`}
                >
                    {!isAnalyzed && <input {...getInputProps()} />}
                    {preview ? (
                        <div className="relative w-full aspect-video">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-contain rounded-lg"
                            />
                            {!isAnalyzed && (
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                    title="Remove image"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-600">
                                {isAnalyzed
                                    ? "Select a different analysis type to reanalyze, or click 'New Analysis' for a new image"
                                    : "Drag & drop an image here, or click to select"}
                            </p>
                            {!isAnalyzed && (
                                <p className="text-sm text-gray-500">
                                    Supported formats: JPEG, PNG, GIF, WebP, BMP (max 10MB)
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload; 