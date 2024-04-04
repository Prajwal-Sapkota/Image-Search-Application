import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchImages from './SearchImages';
import FavoriteImages from './FavoriteImages';
import Navigation from './Navigation';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navigation /> {/* Include the navigation component */}
        <Routes>
          <Route path="/" element={<SearchImages />} />
          <Route path="/favorites" element={<FavoriteImages />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;