import {getRequestConfig} from 'next-intl/server';
import {headers} from 'next/headers';
 
export default getRequestConfig(async () => {
  // Detectar idioma del navegador
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Default inglés, cambiar a español si se detecta
  let locale = 'en';
  if (acceptLanguage.includes('es')) {
    locale = 'es';
  }
  
  // Revisar si hay preferencia guardada en cookie
  const cookieHeader = headersList.get('cookie') || '';
  if (cookieHeader.includes('NEXT_LOCALE=es')) {
    locale = 'es';
  } else if (cookieHeader.includes('NEXT_LOCALE=en')) {
    locale = 'en';
  }
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});