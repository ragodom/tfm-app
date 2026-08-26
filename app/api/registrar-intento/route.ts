import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const n8nUrl = process.env.N8N_REGISTRAR_INTENTO_URL;

    if (!n8nUrl) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "No está configurada la URL del workflow de registro.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Leer primero como texto para evitar que falle si n8n
    // devuelve una respuesta vacía o no válida como JSON.
    const responseText = await response.text();

    console.log("Estado n8n:", response.status);
    console.log("Respuesta n8n:", responseText);

    if (!responseText) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "n8n ha finalizado la ejecución pero no ha devuelto contenido.",
        },
        { status: 502 }
      );
    }

    try {
      const data = JSON.parse(responseText);

      return NextResponse.json(data, {
        status: response.status,
      });
    } catch {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "La respuesta recibida desde n8n no es un JSON válido.",
          respuesta_n8n: responseText,
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Error registrar intento:", error);

    return NextResponse.json(
      {
        ok: false,
        mensaje: "Se ha producido un error al registrar el intento.",
        detalle:
          error instanceof Error
            ? error.message
            : "Error desconocido",
      },
      { status: 500 }
    );
  }
}