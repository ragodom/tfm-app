import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const webhookUrl = process.env.N8N_GENERAR_ACTIVIDAD_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        {
          ok: false,
          error: "Webhook de n8n no configurado",
        },
        { status: 500 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const raw = await response.text();

    if (!raw.trim()) {
      console.error(
        "n8n devolvió una respuesta vacía. Status:",
        response.status
      );

      return NextResponse.json(
        {
          ok: false,
          error: "n8n ha procesado la solicitud pero ha devuelto una respuesta vacía",
        },
        { status: 502 }
      );
    }

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      console.error("Respuesta no JSON recibida desde n8n:", raw);

      return NextResponse.json(
        {
          ok: false,
          error: "n8n ha devuelto una respuesta con formato no válido",
          detalle: raw.slice(0, 500),
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Error en /api/generar-actividad:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "No se ha podido procesar la comunicación con n8n",
      },
      { status: 500 }
    );
  }
}
