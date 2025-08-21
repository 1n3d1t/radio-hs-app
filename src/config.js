export const config = {
  // URL base para imágenes y metadata en Synology (ajusta con tus datos reales)
  synology_base_url: 'http://tu-synology-ip:puerto/public/', // Ej: 'http://192.168.1.100:5000/public/'
  // Logo principal
  synology_logo_url: 'http://tu-synology-ip:puerto/public/logo.jpg', // Ruta al logo en Synology
  github_logo_url: 'https://raw.githubusercontent.com/tu-usuario/radio-visual-app/main/logo_fallback.jpg', // Fallback en GitHub
  // URL para metadata (JSON con {is_live: boolean, artist: string, song: string, event_id: string})
  metadata_url: 'http://tu-synology-ip:puerto/public/current.json',
  // URL del proxy para Spotify
  proxy_url: 'http://tu-synology-ip:puerto/proxy.php',
  // Imagen genérica por defecto
  default_cover_url: '/default_cover.jpg', // Relativa a public/
  // Intervalo de polling (en ms)
  poll_interval: 5000, // 5 segundos
};