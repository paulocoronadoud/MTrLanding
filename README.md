# MTr — Landing Page

Landing page independiente del portal MTr (taxonomía interactiva), lista para desplegarse en **GitHub Pages**.

Extraída del monorepo `MTrPortal/mtrportal-frontend` como proyecto standalone.

## Stack

- React 18 + TypeScript
- Vite 5
- CSS puro (sin framework)
- Animaciones: canvas de partículas, ondas de clic y parallax con el mouse

## Desarrollo local

```bash
npm install
npm run dev
```

Servidor local en `http://localhost:5174`.

## Build de producción

```bash
npm run build
```

Genera el sitio estático en `dist/`. Para previsualizarlo:

```bash
npm run preview
```

## Despliegue en GitHub Pages

El workflow `.github/workflows/deploy.yml` construye y publica automáticamente en cada push a `main`/`master`.

1. Crear el repositorio en GitHub y hacer push de este proyecto:

   ```bash
   git init
   git add .
   git commit -m "Landing MTr"
   git branch -M main
   git remote add origin https://github.com/<usuario>/<nombre-repo>.git
   git push -u origin main
   ```

2. En GitHub: **Settings → Pages → Source → GitHub Actions**.

3. En cada push a `main`, el sitio queda publicado en:
   `https://<usuario>.github.io/<nombre-repo>/`

> El workflow inyecta `BASE_PATH=/<nombre-repo>/` en el build, así que
> no hay que configurar nada más aunque el nombre del repo cambie.

## Enlaces del menú

El ítem **01 — Marco de trabajo** navega a `/visualization` (el portal
principal). La constante `PORTAL_URL` en `src/LandingPage.tsx` permite
apuntar a la URL del portal desplegado si se necesita.
