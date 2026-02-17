/**
 * Cron endpoint para pre-calentar el cache de shows
 * Se ejecuta automáticamente cada 6 horas vía Vercel Cron
 * o puede ser llamado manualmente para forzar refresh
 */

import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    // Verificar authorization (solo permitir desde Vercel Cron o con secret)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    // Si hay CRON_SECRET configurado, validarlo
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Obtener la URL base desde el request o variables de entorno
    const url = new URL(req.url);
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : `${url.protocol}//${url.host}`;

    console.log(`[Cron] Warming shows cache at ${new Date().toISOString()}`);

    // Llamar al endpoint con warm=1 para forzar cache
    const warmResponse = await fetch(`${baseUrl}/api/last-show?warm=1`, {
      headers: {
        // Pasar headers necesarios
        ...(process.env.SETLISTFM_API_KEY && {
          "x-internal-call": "true"
        })
      }
    });

    if (!warmResponse.ok) {
      const errorText = await warmResponse.text();
      console.error(`[Cron] Failed to warm cache: ${warmResponse.status}`, errorText);
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to warm cache", 
          status: warmResponse.status,
          details: errorText
        },
        { status: 500 }
      );
    }

    const data = await warmResponse.json();
    
    console.log(`[Cron] Cache warmed successfully`, {
      hasLatest: !!data.latest,
      hasYearsAgo: !!data.yearsAgoPrev,
      targetYear: data.meta?.targetYear,
      cacheStatus: data.meta?.cache
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        hasLatest: !!data.latest,
        hasYearsAgo: !!data.yearsAgoPrev,
        latestDate: data.latest?.eventDate,
        yearsAgoDate: data.yearsAgoPrev?.eventDate,
        targetYear: data.meta?.targetYear,
        cacheKeys: data.meta?.cache
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Cron] Error warming cache:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error", 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
