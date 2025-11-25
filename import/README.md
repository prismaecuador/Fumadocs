# 📚 Sistema de Importación de Secciones

Este directorio contiene el sistema automatizado para importar y generar documentación en Fumadocs.

## 📁 Estructura

```
import/
├── sections/          # Carpetas de secciones importadas
│   └── ejemplo/       # Cada carpeta = una sección nueva
│       ├── index.md   # Archivo principal (obligatorio)
│       └── capitulo-1.md
└── config.json        # Configuración de marca y colores
```

## 🚀 Cómo usar

### 1. Crear una nueva sección

Crea una carpeta dentro de `import/sections/`:

```bash
mkdir import/sections/mi-seccion
```

### 2. Agregar contenido Markdown

Dentro de la carpeta, crea archivos `.md`:

```bash
# Archivo principal (requerido)
import/sections/mi-seccion/index.md

# Archivos adicionales (opcionales)
import/sections/mi-seccion/capitulo-1.md
import/sections/mi-seccion/capitulo-2.md
```

### 3. Ejemplo de contenido Markdown

**import/sections/mi-seccion/index.md:**
```markdown
---
title: Mi Sección
---

# Mi Sección

Contenido de la sección...

## Subsección

Más contenido...
```

### 4. Configurar marca (opcional)

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

### 5. Ejecutar ingesta

```bash
pnpm ingest
```

Esto automáticamente:
- ✅ Convierte `.md` a `.mdx`
- ✅ Genera páginas en `src/app/`
- ✅ Actualiza la navegación
- ✅ Aplica branding a Tailwind
- ✅ Genera índice de búsqueda

## 📊 Estructura generada

Después de ejecutar `pnpm ingest`:

```
src/content/
├── 00-intro.mdx              # Del README
├── 10-mi-seccion/            # Tu sección importada
│   ├── index.mdx
│   └── capitulo-1.mdx
├── 20-api/                   # Existentes (OpenAPI, GraphQL)
├── 90-guias/
└── 99-changelog.mdx

src/app/
├── page.tsx                  # Home
├── mi-seccion/
│   └── page.tsx              # Generada automáticamente
├── api/
├── guias/
└── changelog/
```

## 🎨 Sistema de numeración

Las secciones se ordenan automáticamente por prefijo numérico:

| Prefijo | Propósito |
|---------|-----------|
| 00-09 | Introducción |
| 10-19 | Tu primera sección importada |
| 20-29 | Referencias de API |
| 30-79 | Secciones adicionales |
| 80-89 | Temas avanzados |
| 90-98 | Guías/Tutoriales |
| 99 | Changelog |

## 📝 Frontmatter

Cada archivo `.md` puede incluir metadatos YAML:

```markdown
---
title: Título de la página
description: Descripción opcional
---

# Contenido...
```

Si no incluyes `title`, se usará el nombre del archivo.

## 🎨 Branding automático

Los colores en `config.json` se aplican automáticamente a:
- Tailwind CSS (`theme.colors.brand`)
- Enlaces en el contenido
- Componentes personalizados

Puedes usar estos colores en tu Markdown con clases Tailwind:

```markdown
<div className="text-brand-highlight font-bold">
  Texto importante
</div>
```

## ⚡ Tips

1. **Orden alfabético**: Las secciones dentro de `import/sections/` se ordenan alfabéticamente
2. **Index.md requerido**: Cada carpeta debe tener un `index.md`
3. **Nombres de carpeta**: Usa nombres descriptivos en minúsculas con guiones (ej: `getting-started`, `best-practices`)
4. **No manual**: No edites `src/content/` ni `src/app/` directamente para secciones importadas
5. **Regenerar**: Ejecuta `pnpm ingest` cada vez que cambies `import/`

## 🔄 Flujo completo

```bash
# 1. Agrega tu sección
mkdir import/sections/nueva-seccion
echo "# Nueva Sección" > import/sections/nueva-seccion/index.md

# 2. Personaliza config.json si necesitas
# (ya tiene valores por defecto)

# 3. Genera la documentación
pnpm ingest

# 4. Levanta el servidor
pnpm dev

# 5. Abre http://localhost:3000/nueva-seccion
```

## ❓ FAQ

**P: ¿Debo crear manualmente las páginas en src/app/?**
R: No, se generan automáticamente.

**P: ¿Puedo personalizar el nombre que aparece en la navegación?**
R: Sí, usa el campo `title` en el frontmatter del `index.md`.

**P: ¿Qué pasa si ejecuto `pnpm ingest` múltiples veces?**
R: Es seguro. El script es idempotente y solo actualiza lo necesario.

**P: ¿Puedo tener subsecciones?**
R: Por ahora, cada carpeta en `sections/` es una sección principal. Los archivos `.md` dentro se convierten en páginas separadas.

**P: ¿Dónde están mis archivos después de `pnpm ingest`?**
R: En `src/content/{numero}-{nombre-seccion}/` como archivos `.mdx`

---

**¡Listo para comenzar! 🚀**

Crea tu primera sección y ejecuta `pnpm ingest` para verla en acción.
