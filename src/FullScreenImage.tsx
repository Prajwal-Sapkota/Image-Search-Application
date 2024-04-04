import React from 'react';
import './FullScreenImage.css';

// Define props interface for the FullScreenImage component
interface FullScreenImageProps {
  imageUrl: string; // URL of the image to display in full screen
  onClose: () => void; // Function to close the full screen image
}

// FullScreenImage component
const FullScreenImage: React.FC<FullScreenImageProps> = ({ imageUrl, onClose }) => {
  return (
    // Overlay div to cover the entire screen and close the full screen image on click
    <div className="fullscreen-image-overlay" onClick={onClose}>
      {/* Image element to display the full screen image */}
      <img src={imageUrl} alt="Full-Screen" className="fullscreen-image" />
    </div>
  );
};

// Export the FullScreenImage component
export default FullScreenImage;
