# 📚 Fumadocs - Generador Automático de Documentación

Fumadocs es un generador automático de sitios de documentación técnica construido con Next.js, MDX y Tailwind CSS.

## 🚀 Características

- ✨ **Generación automática de secciones** desde carpetas en `/import/sections`
- 📄 **Conversión automática** de Markdown a MDX
- 🔄 **Generación automática** de páginas y navegación
- 🎨 **Branding automático** desde archivo de configuración JSON
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

### 2. Crear tu primera sección

```bash
mkdir import/sections/introduccion
cat > import/sections/introduccion/index.md << 'EOF'
---
title: Introducción
---

# Bienvenida

Este es el contenido de tu sección.
EOF
```

### 3. Generar documentación

```bash
pnpm ingest
```

### 4. Levantar servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura de Proyecto

```
fumadocs/
├── import/
│   ├── sections/          # Tus secciones de documentación
│   │   └── introduccion/
│   │       └── index.md
│   ├── config.json        # Configuración de marca
│   └── README.md          # Guía de uso detallada
├── src/
│   ├── app/               # Páginas generadas automáticamente
│   ├── components/        # Componentes React (búsqueda, etc.)
│   ├── content/           # Contenido MDX generado
│   ├── lib/               # Utilidades (nav.ts)
│   └── styles/            # Estilos CSS modulares
├── scripts/
│   └── ingest.ts          # Script de ingesta de contenido
├── public/                # Archivos estáticos
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🎯 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Levanta servidor de desarrollo |
| `pnpm build` | Compila y optimiza para producción |
| `pnpm start` | Inicia servidor de producción |
| `pnpm ingest` | Genera documentación desde `/import/sections` |

## 🎨 Personalización

### Configurar marca

Edita `import/config.json`:

```json
{
  "projectName": "Mi Proyecto",
  "domain": "docs.miproyecto.com",
  "secondaryColors": {
    "highlight": "#3B82F6",
    "accent": "#10B981",
    "hover": "#F59E0B"
  }
}
```

Luego ejecuta `pnpm ingest` para aplicar los cambios.

### Agregar secciones

1. Crea una carpeta en `import/sections/`
2. Agrega archivos `.md` con contenido
3. Ejecuta `pnpm ingest`

Ver [import/README.md](./import/README.md) para más detalles.

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

## 🚀 Deploy

### Vercel (Recomendado)

1. Push a GitHub
2. Conecta repositorio en [Vercel](https://vercel.com)
3. Vercel automáticamente:
   - Instala dependencias
   - Ejecuta `pnpm ingest`
   - Compila el sitio
   - Lo despliega

Ver `.github/workflows/docs.yml` para CI/CD con GitHub Actions.

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
