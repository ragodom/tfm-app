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

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "No se ha podido conectar con n8n",
      },
      { status: 500 }
    );
  }
}