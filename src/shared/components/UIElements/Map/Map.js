import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {
  const { zoom, center } = props;
  const mapEl = useRef();

  useEffect(() => {
    const map = new window.google.maps.Map(mapEl.current, {
      center,
      zoom
    });

    new window.google.maps.Marker({ position: center, map });
  }, [zoom, center]);
  return (
    <div
      ref={mapEl}
      className={`map ${props.mapClass}`}
      style={props.style}
    ></div>
  );
};

export default Map;
