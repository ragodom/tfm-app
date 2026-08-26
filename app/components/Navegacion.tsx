"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navegacion() {
  const pathname = usePathname();

  return (
    <header className="barraNavegacion">
      <div className="navegacionContenido">
        <Link href="/" className="marcaApp">
          Generador educativo
        </Link>

        <nav className="menuPrincipal">
          <Link
            href="/"
            className={pathname === "/" ? "navActivo" : ""}
          >
            Actividades
          </Link>

          <Link
            href="/alumnado"
            className={pathname === "/alumnado" ? "navActivo" : ""}
          >
            Alumnado
          </Link>

          <Link
            href="/material-docente"
            className={
              pathname === "/material-docente" ? "navActivo" : ""
            }
          >
            Material docente
          </Link>
        </nav>
      </div>
    </header>
  );
}