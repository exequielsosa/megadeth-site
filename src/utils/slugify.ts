/**
 * Convierte un string a un slug válido para URLs
 * Elimina acentos, caracteres especiales y normaliza el texto
 * 
 * @param str - El string a convertir
 * @returns El slug normalizado
 * 
 * @example
 * slugify("Teemu Mäntysaari") // "teemu-mantysaari"
 * slugify("Dirk Verbeuren") // "dirk-verbeuren"
 * slugify("Kiko Loureiro") // "kiko-loureiro"
 * slugify("Peace Sells... but Who's Buying?") // "peace-sells-but-whos-buying"
 */
export function slugify(str: string): string {
  return str
    .normalize('NFD') // Normaliza caracteres Unicode (separa acentos de letras)
    .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos/diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '') // Elimina caracteres especiales, mantiene espacios
    .replace(/ /g, '-') // Convierte espacios en guiones
    .replace(/--+/g, '-') // Reemplaza múltiples guiones por uno solo
    .replace(/(^-|-$)/g, ''); // Elimina guiones al inicio y final
}
