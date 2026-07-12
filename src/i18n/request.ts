import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // La URL (vía middleware) determina el locale, no accept-language/cookie
  // como en la versión anterior. `hasLocale` no está disponible como export
  // público en next-intl@4.3.9 instalado acá (verificado contra los .d.ts
  // del paquete) — se valida manualmente contra `routing.locales`.
  const requested = await requestLocale;
  const locale = routing.locales.includes(
    requested as (typeof routing.locales)[number],
  )
    ? (requested as (typeof routing.locales)[number])
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
