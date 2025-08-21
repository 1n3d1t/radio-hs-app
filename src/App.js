import React, { useState, useEffect } from 'react';
import { config } from './config';
import './App.css';

const App = () => {
  const [logoSrc, setLogoSrc] = useState(config.synology_logo_url);
  const [coverSrc, setCoverSrc] = useState(config.default_cover_url);
  const [currentMetadata, setCurrentMetadata] = useState(null);

  // Función para cargar metadata
  const fetchMetadata = async () => {
    try {
      const response = await fetch(config.metadata_url);
      if (!response.ok) throw new Error('Metadata no disponible');
      const data = await response.json();
      setCurrentMetadata(data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
      setCoverSrc(config.default_cover_url);
    }
  };

  // Actualizar cover basado en metadata
  useEffect(() => {
    if (!currentMetadata) return;

    const { is_live, artist, song, event_id } = currentMetadata;
    let synologyCoverUrl;

    if (is_live) {
      synologyCoverUrl = `${config.synology_base_url}${event_id}.jpg`;
    } else {
      synologyCoverUrl = `${config.synology_base_url}${artist}_${song}.jpg`;
    }

    // Verificar si la imagen de Synology existe
    const img = new Image();
    img.src = synologyCoverUrl;
    img.onload = () => setCoverSrc(synologyCoverUrl);
    img.onerror = () => {
      if (is_live) {
        setCoverSrc(config.default_cover_url);
      } else {
        fetchSpotifyCover(artist, song);
      }
    };
  }, [currentMetadata]);

  // Función para buscar cover en Spotify via proxy
  const fetchSpotifyCover = async (artist, song) => {
    try {
      const response = await fetch(`${config.proxy_url}?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`);
      if (!response.ok) throw new Error('Spotify no disponible');
      const data = await response.json();
      const coverUrl = data.tracks?.items?.[0]?.album?.images?.[0]?.url;
      setCoverSrc(coverUrl || config.default_cover_url);
    } catch (error) {
      console.error('Error fetching Spotify:', error);
      setCoverSrc(config.default_cover_url);
    }
  };

  // Polling para actualizaciones automáticas
  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(fetchMetadata, config.poll_interval);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <img 
        src={logoSrc} 
        alt="Logo Principal" 
        className="logo" 
        onError={(e) => {
          e.target.src = config.github_logo_url;
          setLogoSrc(config.github_logo_url);
        }} 
      />
      <img src={coverSrc} alt="Portada Actual" className="cover" />
      {currentMetadata && (
        <div className="info">
          {currentMetadata.is_live ? (
            <p>En directo: {currentMetadata.event_id}</p>
          ) : (
            <p>{currentMetadata.artist} - {currentMetadata.song}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;