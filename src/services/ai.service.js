const API_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL;

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