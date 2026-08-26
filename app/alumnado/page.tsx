"use client";

import { FormEvent, useEffect, useState } from "react";

type Perfil = {
  id: number;
  nombre: string;
  intereses: string | null;
  aficiones: string | null;
  preferencias: string | null;
  perfil_completo: boolean;
  creado_en?: string;
};

export default function AlumnadoPage() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [cargando, setCargando] = useState(true);
  const [creando, setCreando] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [perfilSeleccionado, setPerfilSeleccionado] =
    useState<number | null>(null);

  const [nombre, setNombre] = useState("");
  const [intereses, setIntereses] = useState("");
  const [aficiones, setAficiones] = useState("");
  const [preferencias, setPreferencias] = useState("");

  useEffect(() => {
    cargarPerfiles();

    const guardado = localStorage.getItem("perfilSeleccionado");

    if (guardado) {
      setPerfilSeleccionado(Number(guardado));
    }
  }, []);

  async function cargarPerfiles() {
    setCargando(true);
    setError("");

    try {
      const response = await fetch("/api/gestionar-perfiles", {
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
          data?.mensaje || "No se han podido recuperar los perfiles."
        );
        return;
      }

      setPerfiles(data.perfiles ?? []);
    } catch {
      setError("Se ha producido un error al cargar el alumnado.");
    } finally {
      setCargando(false);
    }
  }

  async function crearPerfil(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCreando(true);
    setError("");
    setMensaje("");

    try {
      const response = await fetch("/api/gestionar-perfiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accion: "crear",
          nombre,
          intereses,
          aficiones,
          preferencias,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(
          data?.mensaje || "No se ha podido crear el perfil."
        );
        return;
      }

      setMensaje("El perfil se ha creado correctamente.");

      setNombre("");
      setIntereses("");
      setAficiones("");
      setPreferencias("");

      await cargarPerfiles();
    } catch {
      setError("Se ha producido un error al crear el perfil.");
    } finally {
      setCreando(false);
    }
  }

  function seleccionarPerfil(perfil: Perfil) {
    if (!perfil.perfil_completo) {
      setError(
        "Este perfil está incompleto y no puede utilizarse para generar actividades."
      );
      return;
    }

    localStorage.setItem("perfilSeleccionado", String(perfil.id));
    localStorage.setItem("perfilSeleccionadoNombre", perfil.nombre);
    setPerfilSeleccionado(perfil.id);
    setError("");
    setMensaje(`${perfil.nombre} ha sido seleccionado.`);
  }
    

  return (
    <main className="pagina">
      <section className="cabecera">
        <p className="eyebrow">Gestión del alumnado</p>
        <h1>Alumnado</h1>

        <p className="descripcion">
          Crea y selecciona perfiles para personalizar las actividades
          educativas según sus intereses, aficiones y preferencias.
        </p>
      </section>

      {error && (
        <section className="mensajeError">
          <strong>Se ha producido un problema</strong>
          <p>{error}</p>
        </section>
      )}

      {mensaje && (
        <section className="mensajeExito">
          <strong>{mensaje}</strong>
        </section>
      )}

      <section className="panel alumnadoPanel">
        <div className="panelTitulo">
          <h2>Perfiles registrados</h2>

          <span className="perfil">
            {perfiles.length} perfiles
          </span>
        </div>

        {cargando ? (
          <p className="textoSecundario">Cargando alumnado...</p>
        ) : perfiles.length === 0 ? (
          <p className="textoSecundario">
            Todavía no hay perfiles registrados.
          </p>
        ) : (
          <div className="listaPerfiles">
            {perfiles.map((perfil) => (
              <article
                key={perfil.id}
                className={
                  perfilSeleccionado === perfil.id
                    ? "tarjetaPerfil perfilActivo"
                    : "tarjetaPerfil"
                }
              >
                <div className="perfilCabecera">
                  <div>
                    <h3>{perfil.nombre}</h3>
                    <span className="idPerfil">
                      Perfil #{perfil.id}
                    </span>
                  </div>

                  <span
                    className={
                      perfil.perfil_completo
                        ? "estadoPerfil estadoCompleto"
                        : "estadoPerfil estadoIncompleto"
                    }
                  >
                    {perfil.perfil_completo
                      ? "Completo"
                      : "Incompleto"}
                  </span>
                </div>

                <div className="datosPerfil">
                  <div>
                    <strong>Intereses</strong>
                    <p>{perfil.intereses || "No indicados"}</p>
                  </div>

                  <div>
                    <strong>Aficiones</strong>
                    <p>{perfil.aficiones || "No indicadas"}</p>
                  </div>

                  <div>
                    <strong>Preferencias</strong>
                    <p>{perfil.preferencias || "No indicadas"}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="botonPerfil"
                  disabled={!perfil.perfil_completo}
                  onClick={() => seleccionarPerfil(perfil)}
                >
                  {perfilSeleccionado === perfil.id
                    ? "Perfil seleccionado"
                    : perfil.perfil_completo
                      ? "Seleccionar perfil"
                      : "Perfil incompleto"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel nuevoPerfil">
        <div className="panelTitulo">
          <div>
            <p className="eyebrow">Nuevo perfil</p>
            <h2>Dar de alta alumnado</h2>
          </div>
        </div>

        <form onSubmit={crearPerfil} className="formulario">
          <label>
            Nombre
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej.: Laura García"
              required
            />
          </label>

          <label>
            Intereses
            <input
              type="text"
              value={intereses}
              onChange={(e) => setIntereses(e.target.value)}
              placeholder="Ej.: Ciencia, tecnología, automovilismo"
            />
          </label>

          <label>
            Aficiones
            <input
              type="text"
              value={aficiones}
              onChange={(e) => setAficiones(e.target.value)}
              placeholder="Ej.: Videojuegos, ciclismo"
            />
          </label>

          <label>
            Preferencias
            <textarea
              value={preferencias}
              onChange={(e) => setPreferencias(e.target.value)}
              placeholder="Ej.: Actividades prácticas y contextualizadas"
            />
          </label>

          <button type="submit" disabled={creando}>
            {creando ? "Creando perfil..." : "Crear perfil"}
          </button>
        </form>
      </section>
    </main>
  );
}