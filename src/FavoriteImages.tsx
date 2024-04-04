import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FavoriteImages.css';
import FullScreenImage from './FullScreenImage';

const FavoriteImages: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteImages, setFavoriteImages] = useState<any[]>([]);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch favorite images from local storage when component mounts
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    // Fetch details of favorite images from Unsplash API using the stored image IDs
    const fetchFavoriteImages = async () => {
      const requests = favorites.map((imageId) =>
        axios.get(`https://api.unsplash.com/photos/${imageId}?client_id=HoepvK5ELTFZMuKm5UU6mwCwi3Hg2ptjxEWvcnb-PrI`)
      );
      try {
        const responses = await Promise.all(requests);
        const favoriteImagesData = responses.map((response) => response.data);
        setFavoriteImages(favoriteImagesData);
      } catch (error) {
        console.error('Error fetching favorite images:', error);
      }
    };

    if (favorites.length > 0) {
      fetchFavoriteImages();
    }
  }, [favorites]);

  const removeFromFavorites = (imageId: string) => {
    // Remove the image ID from the favorites list
    const updatedFavorites = favorites.filter((id) => id !== imageId);
    setFavorites(updatedFavorites);
    // Update local storage with the updated list of favorites
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    // Remove the image from the displayed list
    setFavoriteImages(prevImages => prevImages.filter(image => image.id !== imageId));
  };

  const handleOpenFullScreenImage = (imageUrl: string, event: React.MouseEvent<HTMLImageElement>) => {
    // Check if the click event target is not the remove button
    if ((event.target as HTMLElement).closest('button') === null) {
      setFullScreenImageUrl(imageUrl);
    }
  };

  const handleCloseFullScreenImage = () => {
    // Reset the full-screen image URL to hide the full-screen image
    setFullScreenImageUrl(null);
  };

  return (
    <div className="favorite-images">
      {favoriteImages.map((image: any) => (
        <div key={image.id} className="favorite-image">
          <img src={image.urls.thumb} alt={image.alt_description} onClick={(e) => handleOpenFullScreenImage(image.urls.regular, e)} />
          <div className="image-details">
            <p>Author: {image.user.name}</p>
            <p>Description: {image.alt_description}</p>
            <button className='b1' onClick={() => removeFromFavorites(image.id)}>Remove</button>
          </div>
        </div>
      ))}
      {fullScreenImageUrl && <FullScreenImage imageUrl={fullScreenImageUrl} onClose={handleCloseFullScreenImage} />}
    </div>
  );
};

export default FavoriteImages;
