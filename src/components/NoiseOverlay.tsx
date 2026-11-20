export default function NoiseOverlay() {
  const texture = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="128" height="128" filter="url(#n)" opacity="0.55"/></svg>');
  return <div className="noise-overlay" style={{ backgroundImage: `url("data:image/svg+xml,${texture}")`, backgroundRepeat: 'repeat' }} aria-hidden="true" />;
}
