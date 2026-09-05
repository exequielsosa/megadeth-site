/**
 * URL absoluta de una ruta interna, con el prefijo de locale correcto.
 *
 * Misma convención que `i18nAlternates`: raíz = inglés (sin prefijo),
 * /es/* = español. Se usa en JSON-LD, donde schema.org exige URLs absolutas
 * y el valor debe coincidir con el canonical de la página.
 *
 * @example
 * absoluteUrl("/videos/holy-wars", "es") // "https://megadeth.com.ar/es/videos/holy-wars"
 * absoluteUrl("/videos/holy-wars", "en") // "https://megadeth.com.ar/videos/holy-wars"
 */
export function absoluteUrl(pathname: string, locale: string): string {
  const path = locale === "es" ? `/es${pathname}` : pathname;
  return `https://megadeth.com.ar${path}`;
}
