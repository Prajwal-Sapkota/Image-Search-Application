import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './SearchImages.css';
import FullScreenImage from './FullScreenImage';

const SearchImages: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string | null>(null);
  const observer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${query}&client_id=HoepvK5ELTFZMuKm5UU6mwCwi3Hg2ptjxEWvcnb-PrI`);
        setResults(response.data.results);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (query.trim() !== '') {
      fetchImages();
    } else {
      setResults([]); // Clear previous results if query is empty
    }
  }, [query]);

  const toggleFavorite = (imageId: string) => {
    const isFavorite = favorites.includes(imageId);
    let updatedFavorites: string[];

    if (isFavorite) {
      // Remove imageId from favorites
      updatedFavorites = favorites.filter((id) => id !== imageId);
    } else {
      // Add imageId to favorites
      updatedFavorites = [...favorites, imageId];
    }

    setFavorites(updatedFavorites); // Update favorites state

    // Update local storage with the updated favorites list
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleImageClick = (imageUrl: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target instanceof HTMLElement && !event.target.closest('button')) {
      setFullScreenImageUrl(imageUrl);
    }
  };

  const handleCloseFullScreenImage = () => {
    setFullScreenImageUrl(null);
  };

  return (
    <div className="search-images">
      <input
        type="text"
        placeholder="Search here ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="image-list">
        {results.map((result: any, index) => (
          <div key={result.id} className="image-container" onClick={(event) => handleImageClick(result.urls.full, event)}>
            <img src={result.urls.thumb} alt={result.alt_description} />
            <div className="image-details">
              <p>Author: {result.user.name}</p>
              <p>Description: {result.alt_description}</p>
              <button
                className={`button ${favorites.includes(result.id) ? 'remove-button' : ''}`}
                onClick={() => toggleFavorite(result.id)}
              >
                {favorites.includes(result.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
            {index === results.length - 1 && <div ref={observer}></div>}
          </div>
        ))}
      </div>
      {fullScreenImageUrl && <FullScreenImage imageUrl={fullScreenImageUrl} onClose={handleCloseFullScreenImage} />}
    </div>
  );
};

export default SearchImages;
