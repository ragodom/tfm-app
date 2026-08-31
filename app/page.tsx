"use client";

import { FormEvent, useEffect, useState } from "react";

type Actividad = {
  titulo?: string;
  enunciado?: string;
  objetivo?: string;
  conceptos_utilizados?: string[];
  contexto_personalizacion?: string;
  dificultad?: string;
  puntuacion_maxima?: number;
  errores_trabajados?: string[];
};

type RespuestaN8n = {
  ok?: boolean;
  actividad_id?: number;
  mensaje?: string;
  regenerada?: boolean;
  actividad?: Actividad;
};



type RespuestaIntento = {
  ok?: boolean;
  mensaje?: string;
  error?: string;
  necesita_refuerzo?: boolean;
  refuerzo_generado?: boolean;
  actividad_refuerzo_id?: number;
  actividad_refuerzo?: Actividad;
};

export default function Home() {
  const [perfilId, setPerfilId] = useState<number | null>(null);
  const [perfilNombre, setPerfilNombre] = useState("");

  const [objetivo, setObjetivo] = useState(
    "Utilizar estructuras repetitivas en Python"
  );
  const [tema, setTema] = useState("Bucles for");
  const [dificultad, setDificultad] = useState("básica");

  const [respuesta, setRespuesta] = useState<RespuestaN8n | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [puntuacion, setPuntuacion] = useState("");
  const [erroresIntento, setErroresIntento] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const [respuestaIntento, setRespuestaIntento] =
  useState<RespuestaIntento | null>(null);
  const [errorIntento, setErrorIntento] = useState("");
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  
  useEffect(() => {
    const idGuardado = localStorage.getItem("perfilSeleccionado");
    const nombreGuardado = localStorage.getItem(
      "perfilSeleccionadoNombre"
    );

    if (idGuardado) {
     setPerfilId(Number(idGuardado));
    }

    if (nombreGuardado) {
      setPerfilNombre(nombreGuardado);
    }
}, []);

  async function generarActividad(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!perfilId) {
  setError(
    "Debes seleccionar un perfil de alumnado antes de generar una actividad."
  );
  return;
}

    setCargando(true);
    setError("");
    setRespuesta(null);

    try {
      const response = await fetch("/api/generar-actividad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          perfil_id: perfilId,
          objetivo,
          tema,
          dificultad,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.mensaje ||
            data?.message ||
            "No se ha podido generar la actividad."
        );
        return;
      }

      setRespuesta(data);
      setFechaInicio(new Date());
      setPuntuacion("");
      setErroresIntento("");
      setRespuestaIntento(null);
      setErrorIntento("");
      console.log("Respuesta completa:", data);
      console.log("Actividad ID:", data.actividad_id);
    } catch {
      setError("Se ha producido un error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }
async function registrarIntento(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!respuesta?.actividad_id || !respuesta.actividad) {
    setErrorIntento(
      "No se ha podido identificar la actividad que se quiere registrar."
    );
    return;
  }

  const puntuacionObtenida = Number(puntuacion);
  const puntuacionMaxima = respuesta.actividad.puntuacion_maxima ?? 10;

  if (
    Number.isNaN(puntuacionObtenida) ||
    puntuacionObtenida < 0 ||
    puntuacionObtenida > puntuacionMaxima
  ) {
    setErrorIntento(
      `La puntuación debe estar entre 0 y ${puntuacionMaxima}.`
    );
    return;
  }

  setRegistrando(true);
  setErrorIntento("");
  setRespuestaIntento(null);

  const fechaFin = new Date();
  const inicio = fechaInicio ?? fechaFin;

  const tiempoSegundos = Math.max(
    0,
    Math.round((fechaFin.getTime() - inicio.getTime()) / 1000)
  );

  try {
    const response = await fetch("/api/registrar-intento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actividad_id: respuesta.actividad_id,
        fecha_inicio: inicio.toISOString(),
        fecha_fin: fechaFin.toISOString(),
        tiempo_segundos: tiempoSegundos,
        puntuacion_obtenida: puntuacionObtenida,
        puntuacion_maxima: puntuacionMaxima,
        finalizada: true,
        errores: erroresIntento.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
  if (data?.error === "REFUERZO_NO_VALIDO") {
    setRespuestaIntento(data);
    return;
  }

  setErrorIntento(
    data?.mensaje ||
      data?.error ||
      "No se ha podido registrar el intento."
  );
  return;
}

    setRespuestaIntento(data);
  } catch {
    setErrorIntento(
      "Se ha producido un error al registrar el intento."
    );
  } finally {
    setRegistrando(false);
  }
}
  return (
    <main className="pagina">
      <section className="cabecera">
        <p className="eyebrow">Generador educativo</p>

        <h1>Actividad personalizada</h1>

        <p className="descripcion">
          Genera una actividad adaptada al perfil del alumnado utilizando
          exclusivamente el material docente disponible.
        </p>
      </section>

      <section className="panel">
        <div className="panelTitulo">
          <h2>Nueva actividad</h2>
      {perfilId ? (
       <div
      className="perfilSeleccionadoResumen"
     
>
          {perfilNombre && <strong>{perfilNombre}</strong>}
         <span>Perfil #{perfilId}</span>
         <a href="/alumnado" className="cambiarAlumno">
            Cambiar alumno
        </a>
        </div>
      ) : (
  <span className="perfil">Sin perfil seleccionado</span>
)}
        </div>

        <form onSubmit={generarActividad} className="formulario">
          <label>
            Objetivo de aprendizaje
            <textarea
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              required
            />
          </label>

          <label>
            Tema
            <input
              type="text"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              required
            />
          </label>

          <label>
            Dificultad
            <select
              value={dificultad}
              onChange={(e) => setDificultad(e.target.value)}
            >
              <option value="básica">Básica</option>
              <option value="media">Media</option>
              <option value="avanzada">Avanzada</option>
            </select>
          </label>

          <button type="submit" disabled={cargando || !perfilId}>
            {cargando ? "Generando actividad..." : "Generar actividad"}
          </button>
        </form>
      </section>

      {error && (
        <section className="mensajeError">
          <strong>No se ha podido generar la actividad</strong>
          <p>{error}</p>
        </section>
      )}

      {respuesta?.actividad && (
        <section className="actividad">
          <div className="actividadCabecera">
            <div>
              <p className="eyebrow">Actividad generada</p>
              <h2>{respuesta.actividad.titulo}</h2>
            </div>

            <div className="etiquetas">
              {respuesta.regenerada && (
                <span className="badge">Regenerada</span>
              )}

              {respuesta.actividad.dificultad && (
                <span className="badge">
                  {respuesta.actividad.dificultad}
                </span>
              )}

              {respuesta.actividad.puntuacion_maxima !== undefined && (
                <span className="badge">
                  {respuesta.actividad.puntuacion_maxima} puntos
                </span>
              )}
            </div>
          </div>

          {respuesta.actividad.objetivo && (
            <div className="bloque">
              <h3>Objetivo</h3>
              <p>{respuesta.actividad.objetivo}</p>
            </div>
          )}

          {respuesta.actividad.enunciado && (
            <div className="bloque">
              <h3>Actividad</h3>
              <div className="enunciado">
                {respuesta.actividad.enunciado}
              </div>
            </div>
          )}

          {respuesta.actividad.conceptos_utilizados &&
            respuesta.actividad.conceptos_utilizados.length > 0 && (
              <div className="bloque">
                <h3>Conceptos trabajados</h3>

                <div className="conceptos">
                  {respuesta.actividad.conceptos_utilizados.map(
                    (concepto, index) => (
                      <span key={index}>{concepto}</span>
                    )
                  )}
                </div>
              </div>
            )}

          {respuesta.actividad.contexto_personalizacion && (
            <div className="bloque personalizacion">
              <h3>Personalización</h3>
              <p>{respuesta.actividad.contexto_personalizacion}</p>
            </div>
          )}
{respuesta.actividad_id !== undefined && (
  <div className="bloque resultado">
    <h3>Registrar resultado</h3>

    <p className="resultadoDescripcion">
      Introduce el resultado obtenido al completar la actividad.
      Si la puntuación es inferior al 50 %, el sistema comprobará
      automáticamente si puede generar una actividad de refuerzo.
    </p>

    <form onSubmit={registrarIntento} className="formularioResultado">
      <label>
        Puntuación obtenida
        <input
          type="number"
          min="0"
          max={respuesta.actividad.puntuacion_maxima ?? 10}
          step="0.5"
          value={puntuacion}
          onChange={(e) => setPuntuacion(e.target.value)}
	  disabled={respuestaIntento !== null}
          required
        />
      </label>

      <div className="puntuacionMaxima">
        Puntuación máxima:{" "}
        <strong>
          {respuesta.actividad.puntuacion_maxima ?? 10}
        </strong>
      </div>

      <label>
        Errores o dificultades observadas
        <textarea
          value={erroresIntento}
          onChange={(e) => setErroresIntento(e.target.value)}
          placeholder="Ej.: Dificultades al utilizar range() correctamente."
	  disabled={respuestaIntento !== null}
        />
      </label>

      <button
	type="submit"
  	disabled={registrando || respuestaIntento !== null}
>
  {registrando
    ? "Registrando resultado..."
    : respuestaIntento
      ? "Intento registrado"
      : "Registrar intento"}
</button>
    </form>
{errorIntento && (
  <div className="mensajeError intentoMensaje">
    <strong>No se ha podido registrar el intento</strong>
    <p>{errorIntento}</p>
  </div>
)}

{respuestaIntento?.mensaje && (
  <div
    className={
      respuestaIntento.error === "REFUERZO_NO_VALIDO"
        ? "mensajeAviso"
        : "mensajeExito"
    }
  >
    <strong>
      {respuestaIntento.error === "REFUERZO_NO_VALIDO"
        ? "Intento registrado · refuerzo pendiente de revisión"
        : "Resultado registrado"}
    </strong>

    <p>{respuestaIntento.mensaje}</p>
  </div>
)}

{respuestaIntento?.refuerzo_generado &&
  respuestaIntento.actividad_refuerzo && (
    <div className="refuerzo">
      <div className="refuerzoCabecera">
        <div>
          <p className="eyebrow">Actividad de refuerzo</p>
          <h2>{respuestaIntento.actividad_refuerzo.titulo}</h2>
        </div>

        <div className="etiquetas">
          <span className="badge">Refuerzo</span>

          {respuestaIntento.actividad_refuerzo.dificultad && (
            <span className="badge">
              {respuestaIntento.actividad_refuerzo.dificultad}
            </span>
          )}

          {respuestaIntento.actividad_refuerzo.puntuacion_maxima !==
            undefined && (
            <span className="badge">
              {respuestaIntento.actividad_refuerzo.puntuacion_maxima} puntos
            </span>
          )}
        </div>
      </div>

      {respuestaIntento.actividad_refuerzo.objetivo && (
        <div className="bloque">
          <h3>Objetivo de refuerzo</h3>
          <p>{respuestaIntento.actividad_refuerzo.objetivo}</p>
        </div>
      )}

      {respuestaIntento.actividad_refuerzo.errores_trabajados &&
        respuestaIntento.actividad_refuerzo.errores_trabajados.length > 0 && (
          <div className="bloque">
            <h3>Errores trabajados</h3>

            <div className="conceptos">
              {respuestaIntento.actividad_refuerzo.errores_trabajados.map(
                (error, index) => (
                  <span key={index}>{error}</span>
                )
              )}
            </div>
          </div>
        )}

      {respuestaIntento.actividad_refuerzo.enunciado && (
        <div className="bloque">
          <h3>Actividad de refuerzo</h3>
          <div className="enunciado">
            {respuestaIntento.actividad_refuerzo.enunciado}
          </div>
        </div>
      )}

      {respuestaIntento.actividad_refuerzo.conceptos_utilizados &&
        respuestaIntento.actividad_refuerzo.conceptos_utilizados.length >
          0 && (
          <div className="bloque">
            <h3>Conceptos trabajados</h3>

            <div className="conceptos">
              {respuestaIntento.actividad_refuerzo.conceptos_utilizados.map(
                (concepto, index) => (
                  <span key={index}>{concepto}</span>
                )
              )}
            </div>
          </div>
        )}

      {respuestaIntento.actividad_refuerzo.contexto_personalizacion && (
        <div className="bloque personalizacion">
          <h3>Personalización</h3>
          <p>
            {respuestaIntento.actividad_refuerzo.contexto_personalizacion}
          </p>
        </div>
      )}
    </div>
  )}
</div>
)}

          {respuesta.mensaje && (
            <p className="mensajeFinal">{respuesta.mensaje}</p>
          )}
        </section>
      )}
    </main>
  );
}