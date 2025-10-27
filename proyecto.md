# Documentación Completa del Proyecto Fumadocs-Dezik

## Descripción General

Este proyecto es un generador automatizado de sitios de documentación técnica construido con Next.js, MDX y Tailwind CSS. Permite crear sitios de documentación profesionales de forma rápida y automatizada, convirtiendo archivos comunes del proyecto en páginas web navegables.

## Stack Tecnológico

### Dependencias Principales

- Next.js: Framework de React para aplicaciones web
- React: Librería de interfaces de usuario
- MDX: Permite escribir JSX dentro de archivos Markdown
- Tailwind CSS: Framework de CSS utility-first
- TypeScript: Superset de JavaScript con tipado estático

### Dependencias de Procesamiento

- gray-matter: Extrae frontmatter de archivos Markdown
- fs-extra: Utilidades mejoradas para sistema de archivos
- globby: Búsqueda de archivos con patrones glob
- remark-gfm: Soporte para GitHub Flavored Markdown

### Herramientas de Desarrollo

- tsx: Ejecutor de TypeScript
- autoprefixer: Añade prefijos CSS automáticamente
- tailwindcss/typography: Plugin para estilos de contenido

## Arquitectura del Proyecto

### Estructura de Directorios

```
Fumadocs-Dezik/
├── src/
│   ├── app/                    # Páginas de Next.js (App Router)
│   │   ├── layout.tsx         # Layout principal con sidebar
│   │   ├── page.tsx           # Página de inicio
│   │   ├── api/page.tsx       # Página de API
│   │   ├── arquitectura/page.tsx
│   │   ├── guias/page.tsx
│   │   └── changelog/page.tsx
│   ├── content/               # Archivos MDX de contenido
│   │   ├── 00-intro.mdx
│   │   ├── 10-arquitectura.mdx
│   │   ├── 99-changelog.mdx
│   │   ├── 20-api/
│   │   └── 90-guias/
│   └── lib/
│       └── nav.ts             # Configuración de navegación
├── scripts/
│   ├── ingest.ts              # Script de ingestión de archivos
│   └── bootstrap-docs.ts      # Script de personalización
├── public/                     # Archivos estáticos
├── package.json
├── next.config.ts             # Configuración de Next.js
├── tailwind.config.ts         # Configuración de Tailwind
├── tsconfig.json              # Configuración de TypeScript
└── vercel.json                # Configuración de deploy
```

### Patrones de Diseño

1. File-based Routing: Next.js genera rutas automáticamente desde la carpeta app
2. Client Components: Las páginas usan "use client" para renderizado del lado del cliente
3. MDX as Components: Los archivos MDX se importan como componentes React
4. Static Generation: El contenido se genera en tiempo de build

## Flujo de Trabajo Completo

### FLUJO DETALLADO DE USO

#### ESCENARIO 1: Usuario que quiere crear documentación desde cero

1. Clonar o descargar el repositorio
2. Instalar dependencias: pnpm install
3. Personalizar el sitio con bootstrap:
   - Ejecutar: pnpm bootstrap --project=NombreProyecto --domain=docs.ejemplo.com --color=#HEX
   - Esto reemplaza todos los tokens en archivos del proyecto
   - Actualiza el nombre en layout.tsx, colores en tailwind.config.ts, etc.
4. Crear contenido manualmente:
   - Editar archivos en src/content/
   - Cada archivo MDX tiene frontmatter con título
   - Escribir contenido en Markdown con soporte JSX
5. Iniciar desarrollo: pnpm dev
6. Visualizar en navegador: http://localhost:3000
7. Iterar: Editar contenido y ver cambios en tiempo real
8. Build final: pnpm build
9. Deploy a Vercel o plataforma similar

#### ESCENARIO 2: Usuario con proyecto existente que tiene README, OpenAPI, etc.

1. Copiar el proyecto Fumadocs-Dezik a la raíz de su proyecto
2. Asegurarse de tener en la raíz:
   - README.md (para introducción)
   - openapi.yaml o openapi.json (para API)
   - schema.graphql (para GraphQL)
   - CHANGELOG.md (para changelog)
3. Instalar dependencias: pnpm install
4. Ejecutar ingestión: pnpm ingest
   - Esto automáticamente convierte:
     - README.md → src/content/00-intro.mdx
     - openapi.yaml → src/content/20-api/index.mdx
     - schema.graphql → src/content/20-api/graphql.mdx
     - CHANGELOG.md → src/content/99-changelog.mdx
5. Personalizar marca: pnpm bootstrap --project=MiApp --domain=docs.miapp.com --color=#3B82F6
6. Revisar archivos generados en src/content/
7. Editar manualmente si es necesario
8. Iniciar servidor: pnpm dev
9. Ver documentación generada automáticamente
10. Ajustar navegación en src/lib/nav.ts si se requiere
11. Build: pnpm build
12. Deploy

#### ESCENARIO 3: Flujo de actualización continua

1. Proyecto ya está configurado
2. Se actualiza README.md en el repositorio
3. Ejecutar: pnpm ingest
   - Actualiza automáticamente 00-intro.mdx con nuevo contenido
4. Se actualiza schema de OpenAPI
5. Ejecutar: pnpm ingest
   - Actualiza 20-api/index.mdx con nueva especificación
6. Ejecutar: pnpm build
   - Re-ingesta y construye todo
7. Deploy automático (si está configurado CI/CD)
8. Documentación actualizada en producción

#### FLUJO TÉCNICO INTERNO

Cuando ejecutas pnpm dev:

1. Next.js lee next.config.ts
2. Detecta configuración de MDX con plugin @next/mdx
3. Identifica archivos con extensión .mdx como páginas válidas
4. Compila TypeScript a JavaScript
5. Procesa archivos MDX:
   - Lee frontmatter con gray-matter
   - Convierte Markdown a componentes React
   - Aplica plugins de remark (remark-gfm para tablas, listas, etc.)
6. Tailwind CSS:
   - Escanea archivos según content en tailwind.config.ts
   - Genera CSS solo para clases utilizadas
   - Aplica plugin de typography
7. Servidor escucha cambios (Hot Module Replacement)
8. Al cambiar archivo:
   - Re-compila solo ese módulo
   - Actualiza navegador sin recargar página completa

Cuando ejecutas pnpm build:

1. Ejecuta pnpm ingest primero (definido en package.json)
2. Script ingest.ts:
   - Busca archivos en raíz del proyecto
   - Lee contenido con fs-extra
   - Procesa con gray-matter
   - Escribe en src/content/
3. Next.js build:
   - Modo producción (optimizaciones activas)
   - Pre-renderiza todas las páginas posibles
   - Genera HTML estático para cada ruta
   - Minimiza JavaScript y CSS
   - Optimiza imágenes
   - Crea manifest y chunks
   - Genera .next/static/ con assets versionados
4. Resultado: Carpeta .next/ lista para deploy

Cuando subes a Vercel:

1. Vercel detecta proyecto Next.js (por vercel.json)
2. Ejecuta pnpm install automáticamente
3. Ejecuta pnpm build
4. Deploy de carpeta .next/ a CDN
5. Configura rutas según next.config.ts
6. Aplica configuración de vercel.json:
   - cleanUrls: URLs sin .html
   - trailingSlash: false
7. Asigna dominio automático o personalizado
8. Configuración de wildcard DNS permite subdominios dinámicos

### Paso 1: Instalación de Dependencias

```bash
pnpm install
```

Instala todas las dependencias listadas en package.json utilizando pnpm como gestor de paquetes.

### Paso 2: Ingestión de Contenido

```bash
pnpm ingest
```

Ejecuta el script `scripts/ingest.ts` que realiza las siguientes operaciones:

#### Proceso de Ingestión Detallado

1. Busca README.md en la raíz del proyecto

   - Si existe, lo convierte a src/content/00-intro.mdx
   - Añade frontmatter con title: "Introducción"

2. Busca archivos OpenAPI (openapi.yaml, openapi.yml, openapi.json)

   - Si existe, crea src/content/20-api/index.mdx
   - Incluye el contenido dentro de tags pre para visualización

3. Busca esquemas GraphQL (schema.graphql, schema.gql)

   - Si existe, crea src/content/20-api/graphql.mdx
   - Incluye el esquema dentro de tags pre

4. Busca CHANGELOG.md
   - Si existe, lo convierte a src/content/99-changelog.mdx
   - Añade frontmatter con title: "Changelog"

#### Qué hace gray-matter

gray-matter procesa archivos Markdown y separa:

- Frontmatter: Metadatos en formato YAML entre ---
- Contenido: El resto del archivo Markdown

Ejemplo:

```
---
title: Mi Página
---
# Contenido aquí
```

### Paso 3: Desarrollo Local

```bash
pnpm dev
```

Inicia servidor de desarrollo de Next.js en http://localhost:3000

#### Qué sucede internamente:

1. Next.js compila los archivos TypeScript
2. MDX procesa los archivos .mdx y los convierte en componentes React
3. Tailwind genera los estilos CSS necesarios
4. El servidor queda en modo watch esperando cambios

### Paso 4: Bootstrap (Opcional)

```bash
pnpm bootstrap --project=nombre --domain=docs.ejemplo.com --color=#0EA5E9
```

Ejecuta `scripts/bootstrap-docs.ts` que:

1. Lee los argumentos de línea de comandos
2. Define tokens de reemplazo:

   - **PROJECT_NAME**: Nombre del proyecto
   - **DOMAIN**: Dominio personalizado
   - **BRAND_COLOR**: Color de marca en formato hex

3. Recorre recursivamente todos los archivos .ts, .tsx, .mdx, .json, .mjs, .css
4. Reemplaza todos los tokens encontrados con los valores proporcionados
5. Crea directorios necesarios en src/content si no existen

#### Ejemplo de uso:

Antes: "Bienvenido a **PROJECT_NAME** Docs"
Después: "Bienvenido a MiApp Docs"

### Paso 5: Build para Producción

```bash
pnpm build
```

Ejecuta dos procesos en secuencia:

1. pnpm ingest: Actualiza el contenido desde archivos externos
2. next build: Genera la versión optimizada para producción

#### Proceso de Build:

- Compila TypeScript a JavaScript
- Procesa todos los archivos MDX
- Optimiza imágenes y recursos
- Genera páginas estáticas HTML
- Minimiza CSS y JavaScript
- Crea el directorio .next con la build

### Paso 6: Deploy a Vercel

El archivo vercel.json configura:

- framework: "nextjs" - Indica que es un proyecto Next.js
- cleanUrls: true - URLs sin extensión .html
- trailingSlash: false - URLs sin slash final

#### Requisitos para Deploy:

1. Cuenta en Vercel
2. Variables de entorno (para CI/CD automático):

   - VERCEL_TOKEN
   - VERCEL_ORG_ID
   - VERCEL_PROJECT_ID

3. Configuración DNS para wildcard (opcional):
   - \*.docs.tudominio.com apuntando a cname.vercel-dns.com

## Componentes Principales

### Layout Principal (src/app/layout.tsx)

Estructura:

- Grid de 2 columnas: sidebar (280px) + contenido principal
- Sidebar fijo con navegación
- Área de contenido con clase prose para tipografía

Características:

- lang="es": Idioma español
- suppressHydrationWarning: Evita warnings de hidratación
- Importa estilos globales desde globals.css
- Lee navegación desde lib/nav.ts

### Navegación (src/lib/nav.ts)

Array de objetos con:

- title: Texto visible en el menú
- href: Ruta de la página

Se puede modificar para añadir o quitar secciones.

### Páginas Dinámicas

Cada página sigue el patrón:

```tsx
"use client";
import MDX from "@/content/ruta/archivo.mdx";
export default function Page() {
  return <MDX />;
}
```

El "use client" es necesario porque:

- MDX puede contener componentes interactivos
- Next.js usa Server Components por defecto
- Necesitamos renderizado en el cliente para componentes React

### Configuración MDX (next.config.ts)

- extension: Acepta archivos .md y .mdx
- remarkPlugins: [remarkGfm] - Añade soporte para tablas, checkboxes, etc.
- pageExtensions: ['ts', 'tsx', 'mdx'] - Tipos de archivo que Next.js procesa

### Configuración Tailwind (tailwind.config.ts)

- content: Rutas donde buscar clases de Tailwind
- theme.extend.colors.brand: Color personalizable de marca
- typography: Personaliza estilos de enlaces con color de marca
- plugins: Incluye @tailwindcss/typography para estilos de prosa

## Sistema de Numeración de Contenido

Los archivos usan prefijos numéricos para ordenamiento:

- 00-intro.mdx: Primera sección
- 10-arquitectura.mdx: Segunda sección
- 20-api/: Tercera sección (directorio)
- 90-guias/: Cuarta sección
- 99-changelog.mdx: Última sección

Este sistema permite control manual del orden de visualización.

## Estado Actual del Proyecto

### Qué tiene ahora:

1. Configuración completa de Next.js con App Router
2. Sistema de procesamiento MDX funcional
3. Layout con sidebar y navegación
4. Scripts de automatización:
   - Ingestión de contenido
   - Bootstrap de marca
5. Estilos base con Tailwind CSS
6. Contenido de ejemplo en MDX:
   - Página de introducción
   - Página de arquitectura
   - Estructura para API y guías
7. Configuración para deploy en Vercel

### Qué necesita para funcionar:

Mínimo:

- Node.js instalado (versión 18 o superior recomendada)
- pnpm instalado globalmente
- Ejecutar pnpm install
- Ejecutar pnpm ingest (opcional si no hay archivos externos)
- Ejecutar pnpm dev

Opcional:

- Archivos README.md, openapi.yaml, schema.graphql, CHANGELOG.md para ingestión
- Personalización con bootstrap para branding
- Configuración de Vercel para deploy

## Cómo Probar el Proyecto Ahora Mismo

### Opción 1: Desarrollo Local Rápido

```bash
# 1. Instalar dependencias
pnpm install

# 2. Ejecutar ingestión (crea archivos MDX desde README si existe)
pnpm ingest

# 3. Iniciar servidor de desarrollo
pnpm dev

# 4. Abrir navegador en http://localhost:3000
```

### Opción 2: Con Personalización

```bash
# 1. Instalar dependencias
pnpm install

# 2. Personalizar marca
pnpm bootstrap --project=MiProyecto --domain=docs.miproyecto.com --color=#3B82F6

# 3. Ejecutar ingestión
pnpm ingest

# 4. Iniciar servidor
pnpm dev
```

### Qué verás al abrir http://localhost:3000:

1. Sidebar izquierdo con menú de navegación:

   - Introducción
   - Arquitectura
   - API
   - Guías
   - Changelog

2. Área principal mostrando el contenido de 00-intro.mdx

3. Al hacer clic en cada sección del menú:
   - /: Muestra introducción
   - /arquitectura: Muestra arquitectura
   - /api: Muestra contenido de API (si existe)
   - /guias: Muestra guías (si existe)
   - /changelog: Muestra changelog (si existe)

### Para Verificar que Todo Funciona:

1. Servidor inicia sin errores
2. Navegación funciona entre páginas
3. Estilos se aplican correctamente
4. Contenido MDX se renderiza como HTML

### Problemas Comunes:

1. Error "pnpm not found":

   - Solución: npm install -g pnpm

2. Error en puerto 3000 ocupado:

   - Solución: Cambiar puerto con: pnpm dev -p 3001

3. Archivos MDX no se encuentran:

   - Solución: Ejecutar pnpm ingest primero

4. Estilos no se aplican:
   - Solución: Verificar que globals.css se importe en layout.tsx

## Personalización Avanzada

### Añadir Nueva Sección

1. Crear archivo MDX en src/content/

   ```mdx
   ---
   title: Mi Nueva Sección
   ---

   # Contenido aquí
   ```

2. Crear página en src/app/nueva-seccion/page.tsx:

   ```tsx
   "use client";
   import MDX from "@/content/nueva-seccion.mdx";
   export default function Page() {
     return <MDX />;
   }
   ```

3. Añadir a navegación en src/lib/nav.ts:
   ```ts
   { title: 'Nueva Sección', href: '/nueva-seccion' }
   ```

### Cambiar Colores de Marca

Editar tailwind.config.ts:

```ts
colors: {
  brand: {
    DEFAULT: "#TU_COLOR_AQUI";
  }
}
```

### Añadir Componentes React en MDX

Los archivos MDX pueden incluir componentes:

```mdx
---
title: Mi Página
---

# Título

<MiComponente prop="valor" />

Más contenido...
```

### Modificar Layout

Editar src/app/layout.tsx para:

- Cambiar ancho del sidebar
- Añadir header o footer
- Modificar estructura del grid

## Comandos Disponibles

- pnpm dev: Desarrollo local
- pnpm build: Build de producción
- pnpm start: Servir build de producción
- pnpm ingest: Procesar archivos externos a MDX
- pnpm bootstrap: Personalizar tokens de marca

## Conclusión

Este proyecto es una solución completa y lista para usar como plantilla de documentación técnica. Su principal ventaja es la automatización de la conversión de archivos comunes del proyecto en páginas de documentación navegables, minimizando el trabajo manual de crear y mantener sitios de documentación.
