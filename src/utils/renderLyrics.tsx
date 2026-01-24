import React from "react";

/**
 * Convierte texto con formato **texto** en elementos React con fontWeight 500
 *
 * @param text - El texto con formato markdown simple
 * @returns Array de elementos React
 *
 * @example
 * renderLyricsWithBold("Normal **bold** normal")
 * // => ["Normal ", <strong>bold</strong>, " normal"]
 */
export function renderLyricsWithBold(text: string): React.ReactNode[] {
  if (!text) return [];

  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Agregar texto antes del match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Agregar texto en negrita con fontWeight 600
    parts.push(
      <span key={match.index} style={{ fontWeight: 600 }}>
        {match[1]}
      </span>,
    );

    lastIndex = regex.lastIndex;
  }

  // Agregar el resto del texto
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
