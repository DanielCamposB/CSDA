# Sitio web — Club Social y Deportivo Algarrobo

Sitio institucional y deportivo del club, con panel de administración para que cualquier persona (sin saber programar) pueda actualizar noticias, partidos, jugadores, fotos y más.

**Stack:** Next.js + TypeScript + Tailwind CSS (frontend, gratis en Vercel) + Supabase (base de datos Postgres, login y almacenamiento de fotos, gratis en su tier básico).

## 1. Antes de usar el sitio: aplicar la base de datos

El proyecto todavía no tiene tablas en Supabase. Hazlo una sola vez:

1. Entra a tu proyecto en https://supabase.com/dashboard/project/phwzmbqdrkicyumacwem
2. Ve a **SQL Editor** → **New query**.
3. Copia y pega todo el contenido de `supabase/migrations/0001_init.sql`, ejecútalo (Run).
4. Repite el paso con `supabase/migrations/0002_seed_sports.sql` (crea los 4 deportes: Fútbol, Vóleibol, Fútbolito, Escuela de fútbol).

## 2. Crear tu usuario administrador

1. En el dashboard de Supabase, ve a **Authentication → Users → Add user** y crea un usuario con tu correo y una contraseña.
2. Ve a **SQL Editor** y ejecuta (reemplazando el correo):
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'tu-correo@ejemplo.com');
   ```
3. Ya puedes entrar en `/admin/login` con ese correo y contraseña.

## 3. Ejecutar el sitio en tu computador

```bash
npm install
npm run dev
```

Abre http://localhost:3000. El panel de administración está en http://localhost:3000/admin.

Las variables de entorno ya están en `.env.local` (no se sube a git). Si alguna vez necesitas recrearlas, usa `.env.example` como plantilla.

## 4. Cómo se edita el contenido del día a día (para la persona no técnica)

Todo se administra desde `/admin` una vez logueado, con pantallas simples de "lista + formulario" para:

- Noticias, Eventos, Partidos y resultados, Jugadores, Equipos/Series
- Galería de fotos (subir varias fotos a la vez)
- Trofeos, Historia del club, Directiva, Auspiciadores, Beneficios
- Mensajes recibidos por el formulario de contacto

No requiere tocar código ni la base de datos directamente. Las imágenes se suben desde el propio formulario.

**Pendiente de administrar por ahora:** la sección "Grandes figuras" (`club_figures` en la base de datos) todavía no tiene pantalla propia en `/admin` — mientras tanto se puede cargar directamente desde **Table Editor** en el dashboard de Supabase (sin código, solo llenar una tabla tipo planilla).

## 5. Reemplazar el escudo del club

El escudo real del club (colores negro/dorado/verde/crema) llegó como imagen en el chat pero no se guardó en el proyecto. Reemplázalo así:

1. Guarda el archivo del escudo real (idealmente PNG con fondo transparente) en `public/logo.png`.
2. Reemplaza `src="/logo-placeholder.svg"` por `src="/logo.png"` en estos 4 archivos: `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/app/(public)/page.tsx` y `src/app/admin/login/page.tsx`.

## 6. CAPTCHA del formulario de contacto (opcional pero recomendado)

Por ahora el formulario de contacto funciona sin CAPTCHA (solo con protección honeypot + límite de un mensaje por minuto por correo). Para activar Cloudflare Turnstile (gratis):

1. Crea un sitio en https://dash.cloudflare.com/?to=/:account/turnstile
2. Agrega a `.env.local`:
   ```
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
   TURNSTILE_SECRET_KEY=...
   ```
3. Agrega las mismas variables en Vercel al desplegar.

## 7. Desplegar gratis en Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. Entra a https://vercel.com, conecta el repositorio (plan gratuito).
3. Agrega las variables de entorno de `.env.local` (y las de Turnstile si las usas) en la configuración del proyecto en Vercel.
4. Vercel desplegará automáticamente en cada `git push` a la rama principal. El dominio propio queda pausado por ahora; se puede conectar más adelante desde Vercel → Settings → Domains sin volver a tocar el código.

## Roadmap futuro (no incluido en esta primera entrega)

Estas funciones del documento maestro original quedan para una etapa posterior, cuando el club las necesite:

- Portal privado con roles diferenciados (socio, jugador, entrenador, directiva) más allá del acceso de administrador único.
- Carnet digital, QR, pagos, membresías, reservas de cancha, venta de entradas/camisetas.
- Auditoría avanzada de cambios, notificaciones push, PWA.
- Backend propio en Java/Spring Boot, Redis, Docker y pipeline de QA con Playwright/SonarQube/OWASP ZAP — se optó por Supabase para mantener el proyecto 100% gratuito y de bajo mantenimiento; si el club crece y necesita lógica que Supabase no cubre, se puede incorporar sin rehacer el frontend.
