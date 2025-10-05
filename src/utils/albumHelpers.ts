import type { Album } from '@/types/album';

/**
 * Helper para obtener la descripción de un álbum de forma segura
 * Maneja tanto el formato string (legacy) como el nuevo formato de objeto
 */
export function getAlbumDescription(
  album: Album,
  locale: string = 'es',
  variant: 'short' | 'extended' = 'short'
): string {
  const { description } = album;
  
  // Si no hay descripción, retorna string vacío
  if (!description) {
    return '';
  }
  
  // Si es string (formato legacy), lo retorna tal como está
  if (typeof description === 'string') {
    return description;
  }
  
  // Si es objeto (nuevo formato), extrae la variante y locale correctos
  try {
    const normalizedLocale = locale === 'en' ? 'en' : 'es'; // Por defecto español
    return description[variant][normalizedLocale] || description[variant]['es'] || '';
  } catch (error) {
    console.warn('Error accessing album description:', error);
    return '';
  }
}