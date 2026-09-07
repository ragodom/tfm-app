import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const solicitudId = searchParams.get("solicitud_id");

    if (!solicitudId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Falta solicitud_id",
        },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_ESTADO_GENERACION_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        {
          ok: false,
          error: "Webhook de estado de n8n no configurado",
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${webhookUrl}?solicitud_id=${encodeURIComponent(solicitudId)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const raw = await response.text();

    if (!raw.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "n8n ha devuelto una respuesta vacía",
        },
        { status: 502 }
      );
    }

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "n8n ha devuelto una respuesta con formato no válido",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Error en /api/estado-generacion:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "No se ha podido consultar el estado de la generación",
      },
      { status: 500 }
    );
  }
}