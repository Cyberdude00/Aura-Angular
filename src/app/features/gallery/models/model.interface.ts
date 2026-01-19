export interface Model {
  id: string;
  name: string;
  gender: 'Girl' | 'Boy';
  photo: string;        // Ruta a la foto de portada
  height: string;
  measurements: string;
  hair: string;
  eyes: string;
  shoe: string;
  availability: 'on' | 'off';
  download: string | null;
  portfolio: string[];  // Array de rutas de imágenes/videos
  instagram?: string[];
}
