# 📚 Fumadocs - Generador Automático de Documentación Multi-Cliente

Fumadocs es un generador automático de sitios de documentación técnica construido con Next.js, MDX y Tailwind CSS. Diseñado para soportar múltiples clientes con subdominios independientes.

## 🚀 Características

- ✨ **Multi-cliente**: Soporta múltiples clientes con subdominios independientes
- 🌐 **Subdominios personalizados**: Cada cliente en `cliente.helloprisma.com`
- 📄 **Conversión automática** de Markdown a MDX
- 🔄 **Generación automática** de páginas y navegación
- 🎨 **Branding personalizado** por cliente (colores, logos)
- 🔍 **Búsqueda en tiempo real** sin backend
- 📱 **Diseño responsivo** y moderno
- 🎯 **Deploy automatizado** a Vercel con GitHub Actions

## 📦 Requisitos

- Node.js 18+
- pnpm 8+

## 🏃 Inicio Rápido

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Crear tu primer cliente

**Opción A: Usar el script automático (Recomendado)**

```bash
./scripts/add-client.sh -n acme -f "ACME Corp" -c "#FF5733"
```

**Opción B: Manualmente**

```bash
# Crear estructura
mkdir -p import/clientes/acme/sections/Seccion-1
mkdir -p import/clientes/acme/public

# Crear config.json
cat > import/clientes/acme/config.json << 'EOF'
{
  "projectName": "ACME Corp",
  "domain": "acme.helloprisma.com",
  "secondaryColors": {
    "highlight": "#FF5733",
    "accent": "#EFEFEF",
    "hover": "#CCCCCC"
  }
}
EOF

# Crear contenido
cat > import/clientes/acme/sections/Seccion-1/index.md << 'EOF'
# Bienvenida

Este es el contenido de tu sección.
EOF
```

### 3. Agregar logo del cliente

```bash
# Copiar tu logo (SVG o PNG)
cp /ruta/a/tu/logo.svg import/clientes/acme/public/logo.svg
```

### 4. Generar documentación

```bash
CLIENT_NAME=acme pnpm ingest
```

### 5. Levantar servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000/acme](http://localhost:3000/acme) en tu navegador.

### 6. Deploy con subdominios

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para configuración completa de subdominios en Vercel + Hostinger.

## 📁 Estructura de Proyecto

```
fumadocs/
├── import/
│   └── clientes/              # Directorio multi-cliente
│       ├── partner-gym/       # Cliente actual
│       │   ├── sections/      # Contenido Markdown del cliente
│       │   │   ├── Sección 1/
│       │   │   ├── Sección 2/
│       │   │   └── Sección 3/
│       │   ├── public/        # Assets del cliente (logo, imágenes)
│       │   │   └── logo.svg
│       │   └── config.json    # Configuración de marca
│       └── ...                # Más clientes (agregar con add-client.sh)
├── src/
│   ├── app/                   # Páginas generadas automáticamente
│   │   ├── partner-gym/       # Rutas generadas de Partner Gym
│   │   └── layout.tsx
│   ├── components/            # Componentes React
│   │   ├── Navigation.tsx     # Navegación sidebar
│   │   ├── search.tsx         # Búsqueda en tiempo real
│   │   └── LogoClient.tsx     # Logo dinámico por cliente
│   ├── content/               # Contenido MDX generado por cliente
│   │   └── partner-gym/
│   ├── hooks/
│   │   └── useClientName.ts   # Hook para detectar cliente actual
│   ├── lib/
│   │   └── nav.ts             # Navegación generada
│   ├── styles/                # Estilos CSS modulares
│   └── middleware.ts          # Detección de subdominios
├── scripts/
│   ├── ingest.ts              # Script de ingesta de contenido
│   └── add-client.sh          # Script para agregar clientes
├── public/                    # Assets públicos por cliente
│   ├── partner-gym/
│   └── search-index.json      # Índice de búsqueda
├── DEPLOYMENT.md              # Guía de deploy con subdominios
├── package.json
├── vercel.json                # Configuración Vercel
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🎯 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Levanta servidor de desarrollo |
| `pnpm build` | Compila y optimiza para producción (ejecuta ingest automáticamente) |
| `pnpm start` | Inicia servidor de producción |
| `pnpm ingest` | Genera documentación para todos los clientes |
| `CLIENT_NAME=acme pnpm ingest` | Genera documentación solo para cliente específico |
| `./scripts/add-client.sh` | Script interactivo para agregar nuevo cliente |

## 🎨 Personalización por Cliente

### Configurar marca del cliente

Edita `import/clientes/{nombre-cliente}/config.json`:

```json
{
  "projectName": "Mi Cliente",
  "domain": "micliente.helloprisma.com",
  "secondaryColors": {
    "highlight": "#3B82F6",
    "accent": "#10B981",
    "hover": "#F59E0B"
  }
}
```

Luego ejecuta `CLIENT_NAME=micliente pnpm ingest` para aplicar los cambios.

### Agregar secciones a un cliente

1. Crea una carpeta en `import/clientes/{nombre-cliente}/sections/`
2. Agrega archivos `.md` con contenido
3. Ejecuta `CLIENT_NAME={nombre-cliente} pnpm ingest`

Ver [import/README.md](./import/README.md) para más detalles.

## 🌐 Arquitectura Multi-Cliente con Subdominios

### Cómo funciona

```
Usuario → partnergym.helloprisma.com
    ↓
DNS (Hostinger) → CNAME a Vercel
    ↓
Vercel → Ejecuta Next.js
    ↓
Middleware → Detecta subdominio "partnergym"
    ↓
App → Carga contenido de /partner-gym/*
    ↓
Renderiza → Con branding de Partner Gym
```

### Clientes actuales

- **Partner Gym**: `partnergym.helloprisma.com`

### Agregar un nuevo cliente

```bash
# 1. Crear estructura con script
./scripts/add-client.sh -n acme -f "ACME Corp" -c "#FF5733"

# 2. Agregar logo
cp logo.svg import/clientes/acme/public/logo.svg

# 3. Generar sitio
CLIENT_NAME=acme pnpm ingest

# 4. Configurar DNS en Hostinger
# Tipo: CNAME
# Nombre: acme
# Valor: cname.vercel-dns.com

# 5. Agregar dominio en Vercel
# acme.helloprisma.com

# 6. Deploy
git add . && git commit -m "feat: Add ACME client" && git push
```

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para guía completa de configuración DNS y Vercel.

## 📖 Cómo Usar

### Crear una sección

```bash
mkdir import/sections/mi-seccion
touch import/sections/mi-seccion/index.md
```

### Contenido Markdown

Los archivos `.md` soportan frontmatter YAML:

```markdown
---
title: Mi Página
description: Descripción opcional
---

# Contenido

Tu contenido aquí...

## Subsecciones

Con [links](https://ejemplo.com) y **estilos**.
```

### Generar sitio

```bash
pnpm ingest
```

Automáticamente:
- ✅ Convierte `.md` a `.mdx`
- ✅ Genera páginas en `src/app/`
- ✅ Actualiza navegación
- ✅ Aplica branding
- ✅ Crea índice de búsqueda

## 🚀 Deploy con Subdominios

### Vercel + Hostinger (Recomendado)

**Requisitos previos:**
- Dominio `helloprisma.com` en Hostinger
- Cuenta de Vercel conectada a GitHub

**Paso a paso:**

1. **Deploy inicial en Vercel**
   ```bash
   # Push a GitHub
   git push origin main

   # Vercel automáticamente:
   # - Instala dependencias
   # - Ejecuta pnpm ingest
   # - Compila el sitio
   # - Lo despliega
   ```

2. **Configurar dominios en Vercel**
   - Ve a **Settings** → **Domains**
   - Agrega `*.helloprisma.com` (wildcard)
   - Agrega subdominios específicos:
     - `partnergym.helloprisma.com`
     - `example.helloprisma.com`

3. **Configurar DNS en Hostinger**
   - Ve a **DNS / Servidores de Nombres**
   - Agrega registros CNAME:
     ```
     CNAME  partnergym  →  cname.vercel-dns.com
     CNAME  example     →  cname.vercel-dns.com
     CNAME  *           →  cname.vercel-dns.com (wildcard)
     ```

4. **Esperar propagación DNS** (5-30 minutos)

5. **Verificar**
   - `https://partnergym.helloprisma.com`
   - `https://example.helloprisma.com`

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para guía detallada con troubleshooting.

## 📝 Frontmatter Soportado

```markdown
---
title: Título de la página
description: Descripción para SEO
---
```

- `title` (requerido): Título de la página, usado en navegación y búsqueda
- `description`: Descripción opcional para metadatos

## 🔍 Búsqueda

La búsqueda funciona automáticamente:
- Indexa todas las páginas
- Busca en tiempo real sin backend
- Muestra snippets contextuales
- Navega con Enter o click

## 🎨 Estilos

### Tailwind CSS

Personaliza `tailwind.config.ts` para agregar estilos personalizados. Los colores de marca se aplican automáticamente.

### CSS Modular

Los estilos están organizados en `src/styles/`:
- `global.css` - Estilos globales
- `layout.css` - Grid y layout
- `typography.css` - Tipografía
- `components.css` - Componentes UI
- `colors.css` - Variables de color

## 🔧 Tecnologías

- **Next.js 16** - Framework React con SSR/SSG
- **MDX** - Markdown + componentes React
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Tipado estático
- **pnpm** - Gestor de paquetes rápido

## 📚 Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de MDX](https://mdxjs.com)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

## 📄 Licencia

MIT

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor abre un issue o pull request.

---

**¿Preguntas?** Revisa [import/README.md](./import/README.md) para una guía detallada.
