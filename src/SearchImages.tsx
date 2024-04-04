import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './SearchImages.css';
import FullScreenImage from './FullScreenImage';

const SearchImages: React.FC = () => {
  // State variables
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string | null>(null);
  // Ref for intersection observer
  const observer = useRef<HTMLDivElement>(null);

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: any;
    return (...args: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Effect to fetch images based on search query with debounced input
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${query}&client_id=HoepvK5ELTFZMuKm5UU6mwCwi3Hg2ptjxEWvcnb-PrI`);
        setResults(response.data.results);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    const debouncedFetchImages = debounce(fetchImages, 500); // Adjust debounce delay as needed

    if (query.trim() !== '') {
      debouncedFetchImages();
    } else {
      // Clear previous results if query is empty
      setResults([]);
    }
  }, [query]);

  // Function to handle click on an image
  const handleImageClick = (imageUrl: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target instanceof HTMLElement && !event.target.closest('button')) {
      setFullScreenImageUrl(imageUrl);
    }
  };

  // Function to toggle favorite status of an image
  const toggleFavorite = (imageId: string) => {
    const index = favorites.indexOf(imageId);
    if (index !== -1) {
      const updatedFavorites = [...favorites];
      updatedFavorites.splice(index, 1);
      setFavorites(updatedFavorites);
    } else {
      const updatedFavorites = [...favorites, imageId];
      setFavorites(updatedFavorites);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  // Function to close the full screen image
  const handleCloseFullScreenImage = () => {
    setFullScreenImageUrl(null);
  };

  return (
    <div className='input'>
      <input type="text" placeholder='Search here ...' value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="image-list">
        {results.map((result: any, index) => (
          <div key={result.id} className="image-container" onClick={(event) => handleImageClick(result.urls.full, event)}>
            <img src={index < 10 ? result.urls.thumb : ''} alt={result.alt_description} />
            <div className="image-details">
              <p>Author: {result.user.name}</p>
              <p>Description: {result.alt_description}</p>
              <button className={`button ${favorites.includes(result.id) ? 'remove-button' : ''}`} onClick={() => toggleFavorite(result.id)}>
                {favorites.includes(result.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
            {/* Intersection observer to detect when the last image is rendered */}
            {index === results.length - 1 && <div ref={observer}></div>}
          </div>
        ))}
      </div>
      {/* Full screen image component */}
      {fullScreenImageUrl && <FullScreenImage imageUrl={fullScreenImageUrl} onClose={handleCloseFullScreenImage} />}
    </div>
  );
};

export default SearchImages;
