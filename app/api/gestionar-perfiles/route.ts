import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const n8nUrl = process.env.N8N_GESTIONAR_PERFILES_URL;

    if (!n8nUrl) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "No está configurada la URL de gestión de perfiles.",
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

    const data = JSON.parse(responseText);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Error gestionando perfiles:", error);

    return NextResponse.json(
      {
        ok: false,
        mensaje: "Se ha producido un error al gestionar los perfiles.",
      },
      { status: 500 }
    );
  }
}