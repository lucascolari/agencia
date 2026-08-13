# Cómo cargar el material del diseñador

Soltá los archivos en estas carpetas (en tu PC: `C:\dev\agencia\public\media\`):

- `hero/` → el video principal de la home (y su versión mobile si hay).
  - Ideal: `hero.mp4` (desktop) y `hero-mobile.mp4` (vertical/cuadrado para celular).
  - Formato: MP4 (H.264). Si es muy pesado (+20 MB) avisá, lo comprimimos.
- `proyectos/` → imágenes y videos de cada proyecto.
  - Nombralos claro: `nucleo-1.jpg`, `faro-portada.jpg`, `volta-reel.mp4`, etc.
  - Imágenes: JPG o PNG. Videos: MP4.

Cuando estén acá, pasame **la lista de nombres de archivo** (o decime "ya están")
y yo los conecto a la web (portadas, galerías, hero) y verifico que se vean bien.

## Nota sobre videos pesados

Los videos locales sirven para probar ya. Para producción final, el video del
hero conviene moverlo a **Mux** (streaming adaptativo, carga más rápida, no
infla el repo). Las imágenes se pueden mover a **Cloudinary** (ya conectado).
Eso lo hacemos como segundo paso, sin que cambie nada visual.
