"use client";

import { FormEvent, useEffect, useState } from "react";

type DocumentoRag = {
  id: number;
  titulo: string | null;
  tema: string | null;
  fuente: string | null;
  texto: string;
  numero_chunks?: number;
  estado?: string;
  creado_en?: string;
};

export default function MaterialDocentePage() {
  const [documentos, setDocumentos] = useState<DocumentoRag[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [tema, setTema] = useState("");
  const [fuente, setFuente] = useState("");
  const [texto, setTexto] = useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarDocumentos();
  }, []);

  async function cargarDocumentos() {
    setCargando(true);
    setError("");

    try {
      const response = await fetch("/api/gestionar-material-rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accion: "listar",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(
          data?.mensaje ||
            "No se ha podido recuperar el material docente."
        );
        return;
      }

      setDocumentos(data.documentos ?? []);
    } catch {
      setError(
        "Se ha producido un error al cargar el material docente."
      );
    } finally {
      setCargando(false);
    }
  }
  async function eliminarDocumento(materialId: number) {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este material docente? También se eliminarán sus fragmentos RAG asociados."
    );

    if (!confirmar) {
      return;
    }

    setError("");
    setMensaje("");

    try {
      const response = await fetch("/api/gestionar-material-rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accion: "eliminar",
          material_id: materialId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(
          data?.mensaje ||
            "No se ha podido eliminar el material docente."
        );
        return;
      }

      setMensaje(
        data?.mensaje ||
          "El material docente se ha eliminado correctamente."
      );

      await cargarDocumentos();
    } catch {
      setError(
        "Se ha producido un error al eliminar el material docente."
      );
    }
  }
  async function cambiarEstadoDocumento(
    materialId: number,
    accion: "desactivar" | "reactivar"
  ) {
    setError("");
    setMensaje("");

    try {
      const response = await fetch("/api/gestionar-material-rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accion,
          material_id: materialId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(
          data?.mensaje ||
            `No se ha podido ${accion} el material docente.`
        );
        return;
      }

      setMensaje(
        data?.mensaje ||
          `El material docente se ha ${accion === "desactivar" ? "desactivado" : "reactivado"} correctamente.`
      );

      await cargarDocumentos();
    } catch {
      setError(
        `Se ha producido un error al ${accion} el material docente.`
      );
    }
  }
  async function crearDocumento(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      const response = await fetch("/api/gestionar-material-rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accion: "crear",
          titulo,
          tema,
          fuente,
          texto,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(
          data?.mensaje ||
            "No se ha podido incorporar el material al RAG."
        );
        return;
      }

      setMensaje(
        data?.mensaje ||
          "El material docente se ha incorporado correctamente."
      );

      setTitulo("");
      setTema("");
      setFuente("");
      setTexto("");

      await cargarDocumentos();
    } catch {
      setError(
        "Se ha producido un error al guardar el material docente."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main className="pagina">
      <section className="cabecera">
        <p className="eyebrow">Base académica</p>
        <h1>Material docente</h1>

        <p className="descripcion">
          Gestiona los contenidos utilizados por el sistema RAG
          como referencia académica para generar y validar
          actividades.
        </p>
      </section>

      {error && (
        <section className="panel">
          <strong>Error</strong>
          <p>{error}</p>
        </section>
      )}

      {mensaje && (
        <section className="panel">
          <strong>Material incorporado</strong>
          <p>{mensaje}</p>
        </section>
      )}
<section className="panel materialFormulario">
  <div className="panelTitulo">
    <div>
      <p className="eyebrow">Nuevo material</p>
      <h2>Añadir contenido docente</h2>
    </div>
  </div>

  <form onSubmit={crearDocumento} className="formulario">
    <label>
      Título
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Ej.: Introducción a los bucles while"
        required
      />
    </label>

    <label>
      Tema
      <input
        type="text"
        value={tema}
        onChange={(e) => setTema(e.target.value)}
        placeholder="Ej.: Bucles while"
        required
      />
    </label>

    <label>
      Fuente
      <input
        type="text"
        value={fuente}
        onChange={(e) => setFuente(e.target.value)}
        placeholder="Ej.: Material docente de programación"
        required
      />
    </label>

    <label>
      Contenido
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Introduce aquí el contenido académico..."
        rows={10}
        className="textoMaterial"
        required
      />
    </label>

    <button type="submit" disabled={guardando}>
      {guardando
        ? "Incorporando al RAG..."
        : "Añadir al material docente"}
    </button>
  </form>
</section>
            <section className="panel">
        <h2>Material disponible</h2>

        {cargando ? (
          <p>Cargando material docente...</p>
        ) : documentos.length === 0 ? (
          <p>No hay material docente cargado.</p>
        ) : (
          <div>
            {documentos.map((documento) => (
              <article
                key={documento.id}
                className="tarjetaDocumento"
              >
                <h3>
                  {documento.titulo || "Documento sin título"}
                </h3>

                <p>
                  <strong>Tema:</strong>{" "}
                  {documento.tema || "No indicado"}
                </p>

                <p>
                  <strong>Fuente:</strong>{" "}
                  {documento.fuente || "No indicada"}
                </p>

                {documento.numero_chunks !== undefined && (
                  <p>
                    <strong>Fragmentos RAG:</strong>{" "}
                    {documento.numero_chunks}
                  </p>
                )}

                <p>{documento.texto}</p>

                <p>
                  <strong>Estado:</strong>{" "}
                  {documento.estado === "activo"
                    ? "Activo"
                    : "Inactivo"}
                </p>

                <div className="accionesDocumento">
                  {documento.estado === "activo" ? (
                    <button
                      type="button"
                      onClick={() =>
                        cambiarEstadoDocumento(
                          documento.id,
                          "desactivar"
                        )
                      }
                    >
                      Desactivar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        cambiarEstadoDocumento(
                          documento.id,
                          "reactivar"
                        )
                      }
                    >
                      Reactivar
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      eliminarDocumento(documento.id)
                    }
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}