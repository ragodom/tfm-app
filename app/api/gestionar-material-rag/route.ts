import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const n8nUrl = process.env.N8N_GESTIONAR_MATERIAL_RAG_URL;

    if (!n8nUrl) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "No está configurada la URL del workflow de gestión de material RAG.",
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

    const responseText = await response.text();

    if (!responseText) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "n8n no ha devuelto contenido.",
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
    console.error("Error gestionando material RAG:", error);

    return NextResponse.json(
      {
        ok: false,
        mensaje:
          "Se ha producido un error al gestionar el material docente.",
      },
      { status: 500 }
    );
  }
}