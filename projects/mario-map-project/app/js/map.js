const map = L.map('map', {
  crs: L.CRS.Simple,
  renderer: L.Canvas,
  zoomDelta: 0.5,
  zoomSnap: 0.5,
  fullscreenControl: true
}).setView([-68.95, 80.35], 6);

L.tileLayer('assets/maps/Tiles/{z}/{x}/{y}.webp', {
  minZoom: 2,
  maxZoom: 9,
  noWrap: true,
  continuousWorld: false,
  edgeBufferTiles: 2,
  tileSize: 256
}).addTo(map);

map.setMaxBounds([[-292, -150], [100, 330]]);
