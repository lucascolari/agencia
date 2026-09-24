/**
 * Estado de carga a nivel ruta. La Ficha 00 exige que la pantalla arranque en
 * negro absoluto, sin mensajes, spinners ni barras de carga: solo el vacío.
 */
export default function Loading() {
  return <div aria-hidden className="min-h-[100svh] bg-[#000]" />;
}
