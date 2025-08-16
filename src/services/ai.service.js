// Validate and set the API URL with proper fallback
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL;
if (!AI_SERVICE_URL) {
    console.error('❌ NEXT_PUBLIC_AI_SERVICE_URL environment variable is not set!');
    console.error('💡 Please set NEXT_PUBLIC_AI_SERVICE_URL in your .env.local file');
    console.error('   Example: NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:5000');
}

const API_URL = AI_SERVICE_URL || 'http://localhost:5000';

export const analyzeArtwork = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/analyze/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze artwork');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing artwork:', error);
    throw error;
  }
};

export const analyzeArtworkUrl = async (imageUrl) => {
  try {
    const response = await fetch(`${API_URL}/analyze/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze artwork URL');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing artwork URL:', error);
    throw error;
  }
}; 