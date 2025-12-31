import fs from 'fs-extra'
import path from 'path'
import { globbySync } from 'globby'
import matter from 'gray-matter'

const SRC = process.cwd()
const IMPORT_DIR = path.join(SRC, 'import')
const CLIENTS_DIR = path.join(IMPORT_DIR, 'clientes')

// Detectar cliente desde variable de entorno o usar el primero disponible
const TARGET_CLIENT = process.env.CLIENT_NAME || getDefaultClient()

const CONTENT = path.join(SRC, 'src', 'content', TARGET_CLIENT)
const APP = path.join(SRC, 'src', 'app')
const PUBLIC_DIR = path.join(SRC, 'public')
const SECTIONS_DIR = path.join(CLIENTS_DIR, TARGET_CLIENT, 'sections')
const CONFIG_FILE = path.join(CLIENTS_DIR, TARGET_CLIENT, 'config.json')
const CLIENT_PUBLIC_SRC = path.join(CLIENTS_DIR, TARGET_CLIENT, 'public')
const CLIENT_PUBLIC_DEST = path.join(PUBLIC_DIR, TARGET_CLIENT)

function getDefaultClient(): string {
  if (!fs.existsSync(CLIENTS_DIR)) {
    return 'default'
  }
  const clients = fs.readdirSync(CLIENTS_DIR)
  return clients.length > 0 ? clients[0] : 'default'
}

type RouteMap = Map<string, string>
type BrandConfig = {
  projectName: string
  domain: string
  secondaryColors: {
    highlight: string
    accent: string
    hover: string
  }
}

type NavItem = {
  title: string
  href: string
  items?: NavItem[]
}

// Función para convertir nombres a slugs URL-safe
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Descomponer caracteres con tildes
    .replace(/[\u0300-\u036f]/g, '') // Eliminar marcas diacríticas (tildes)
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
}

// Función para limpiar nombres de archivo removiendo IDs tipo Notion
function cleanNotionId(text: string): string {
  // Remover IDs tipo: "Nombre 2d3ac768aa29805bbb1bf19124e6ba04"
  return text.replace(/\s+[0-9a-f]{32}$/i, '').trim()
}

// Función para extraer el primer H1 del contenido markdown
function extractFirstH1(content: string): string | null {
  const h1Match = content.match(/^#\s+(.+)$/m)
  return h1Match ? h1Match[1].trim() : null
}

async function readBrandConfig(): Promise<BrandConfig | null> {
  if (!fs.existsSync(CONFIG_FILE)) return null
  const config = await fs.readJson(CONFIG_FILE)
  return config as BrandConfig
}

async function importFromSections() {
  if (!fs.existsSync(SECTIONS_DIR)) {
    console.log(`⚠️  No se encontraron secciones en: ${SECTIONS_DIR}`)
    return
  }

  const sectionDirs = await fs.readdir(SECTIONS_DIR)
  const sortedDirs = sectionDirs.sort()

  let sectionNumber = 10

  for (const sectionName of sortedDirs) {
    const sectionPath = path.join(SECTIONS_DIR, sectionName)
    const stat = await fs.stat(sectionPath)

    if (!stat.isDirectory()) continue

    const mdFiles = await fs.readdir(sectionPath)
    const markdownFiles = mdFiles.filter(f => f.endsWith('.md') || f.endsWith('.mdx')).sort()

    if (markdownFiles.length === 0) continue

    // Usar slug para el nombre de carpeta, pero guardar el nombre original
    const sectionSlug = slugify(sectionName)
    const sectionContentDir = path.join(CONTENT, `${sectionNumber.toString().padStart(2, '0')}-${sectionSlug}`)
    await fs.ensureDir(sectionContentDir)

    // Si no hay index.md, usar el primer archivo como index
    const hasIndex = markdownFiles.some(f => f === 'index.md' || f === 'index.mdx')
    const firstFile = markdownFiles[0]

    for (const mdFile of markdownFiles) {
      const mdPath = path.join(sectionPath, mdFile)
      const raw = await fs.readFile(mdPath, 'utf8')

      const parsed = matter(raw)

      // Procesar rutas de imágenes - convertir a rutas públicas del cliente
      let content = parsed.content
      // Reemplazar rutas de imágenes relativas con rutas de /public/{cliente}/
      // Busca patrones como: ![alt](../folder/image.png) o ![alt](folder/image.png)
      content = content.replace(/!\[([^\]]*)\]\((?!https?|\/)[^)]*\/([^/)]+)\)/g, `![$1](/${TARGET_CLIENT}/$2)`)
      // También maneja rutas sin carpeta padre
      content = content.replace(/!\[([^\]]*)\]\(([^/)]+\.[a-z]+)\)/g, `![$1](/${TARGET_CLIENT}/$2)`)

      // No agregar frontmatter - el contenido ya tiene su H1 interno
      const mdxContent = content

      const mdxFileName = mdFile.replace(/\.md$/, '.mdx')
      const mdxPath = path.join(sectionContentDir, mdxFileName)

      await fs.outputFile(mdxPath, mdxContent)
      console.log(`• ${sectionName}/${mdFile} → src/content/${TARGET_CLIENT}/${path.basename(sectionContentDir)}/${mdxFileName}`)

      // Si este es el primer archivo y no hay index, crear una copia como index.mdx
      if (!hasIndex && mdFile === firstFile) {
        const indexPath = path.join(sectionContentDir, 'index.mdx')
        await fs.outputFile(indexPath, content)
        console.log(`• ${sectionName}/${mdFile} → src/content/${TARGET_CLIENT}/${path.basename(sectionContentDir)}/index.mdx (auto-generado)`)
      }
    }

    sectionNumber += 10
  }
}

async function generatePageFiles() {
  const contentDirs = await fs.readdir(CONTENT)
  const sortedDirs = contentDirs.sort()
  let firstSection = ''

  for (const dir of sortedDirs) {
    const dirPath = path.join(CONTENT, dir)
    const stat = await fs.stat(dirPath)

    if (!stat.isDirectory()) continue

    const sectionName = dir.replace(/^\d+-/, '')
    const appDir = path.join(APP, TARGET_CLIENT, sectionName)

    // Guardar la primera sección para la página raíz
    if (!firstSection) {
      firstSection = sectionName
    }

    await fs.ensureDir(appDir)

    const mdxFiles = await fs.readdir(dirPath)
    const indexFile = mdxFiles.find(f => f === 'index.mdx' || f === 'index.md')

    // Generar página principal de la sección (index)
    if (indexFile) {
      const pageFile = path.join(appDir, 'page.tsx')
      const contentPath = `@/content/${TARGET_CLIENT}/${dir}/${indexFile}`

      const pageContent = `"use client";

import MDX from "${contentPath}";

export default function Page() {
  return <MDX />;
}
`

      await fs.outputFile(pageFile, pageContent)
      console.log(`• Página generada → src/app/${TARGET_CLIENT}/${sectionName}/page.tsx`)
    }

    // Generar páginas para subsecciones
    const subSections = mdxFiles.filter(f => f.endsWith('.mdx') && f !== 'index.mdx')

    for (const subFile of subSections) {
      const subFileName = subFile.replace(/\.mdx$/, '')
      const subSlug = slugify(subFileName)
      const subAppDir = path.join(appDir, subSlug)
      const subPageFile = path.join(subAppDir, 'page.tsx')

      await fs.ensureDir(subAppDir)

      const contentPath = `@/content/${TARGET_CLIENT}/${dir}/${subFile}`

      const pageContent = `"use client";

import MDX from "${contentPath}";

export default function Page() {
  return <MDX />;
}
`

      await fs.outputFile(subPageFile, pageContent)
      console.log(`• Subsección generada → src/app/${TARGET_CLIENT}/${sectionName}/${subSlug}/page.tsx`)
    }
  }

  // Generar página raíz del cliente que redirija a la primera sección
  if (firstSection) {
    const rootPageFile = path.join(APP, TARGET_CLIENT, 'page.tsx')
    const rootPageContent = `import { redirect } from 'next/navigation'

export default function ClientRootPage() {
  redirect('/${firstSection}')
}
`
    await fs.outputFile(rootPageFile, rootPageContent)
    console.log(`• Página raíz generada → src/app/${TARGET_CLIENT}/page.tsx (redirige a /${firstSection})`)
  }
}

async function generateNavigation(): Promise<NavItem[]> {
  const nav: NavItem[] = []

  const contentDirs = await fs.readdir(CONTENT)
  const sortedDirs = contentDirs.sort()

  for (const dir of sortedDirs) {
    const dirPath = path.join(CONTENT, dir)
    const stat = await fs.stat(dirPath)

    if (!stat.isDirectory()) continue

    const indexPath = path.join(dirPath, 'index.mdx')
    if (!fs.existsSync(indexPath)) continue

    // Usar el nombre de la carpeta original (sin el prefijo numérico) para el título
    // Esto se obtiene del nombre original de la carpeta en sections/
    // Primero, obtener el índice de la sección del prefijo
    const prefix = dir.match(/^(\d+)-/)?.[1]

    // Buscar la carpeta original en sections
    const sectionDirs = await fs.readdir(SECTIONS_DIR)
    const sortedSectionDirs = sectionDirs.sort()
    const sectionIndex = prefix ? Math.floor((parseInt(prefix) - 10) / 10) : 0
    const originalSectionName = sortedSectionDirs[sectionIndex] || dir.replace(/^\d+-/, '')

    // Limpiar el nombre de la carpeta de IDs de Notion pero mantener mayúsculas, tildes, etc.
    const sectionTitle = cleanNotionId(originalSectionName)

    const sectionName = dir.replace(/^\d+-/, '') // Remover prefijo numérico (slug)
    // No incluir el prefijo del cliente en las rutas, solo el path
    const href = '/' + sectionName

    // Buscar subsecciones (archivos .mdx que NO sean index.mdx)
    const mdxFiles = await fs.readdir(dirPath)
    const subSections = mdxFiles
      .filter(f => f.endsWith('.mdx') && f !== 'index.mdx')
      .sort()

    const navItem: NavItem = {
      title: sectionTitle,
      href: href
    }

    // Si hay subsecciones, agregarlas
    if (subSections.length > 0) {
      navItem.items = []

      for (const subFile of subSections) {
        const subFilePath = path.join(dirPath, subFile)
        const subContent = await fs.readFile(subFilePath, 'utf8')
        const subParsed = matter(subContent)

        const subH1Title = extractFirstH1(subParsed.content)
        const cleanSubFileName = cleanNotionId(subFile.replace(/\.mdx$/, ''))
        const subTitle = subParsed.data.title || subH1Title || cleanSubFileName
        const subSlug = slugify(subFile.replace(/\.mdx$/, ''))
        const subHref = `${href}/${subSlug}`

        navItem.items.push({
          title: subTitle,
          href: subHref
        })
      }
    }

    nav.push(navItem)
  }

  return nav
}

async function updateNavFile(nav: NavItem[]) {
  // Guardar nav específico del cliente
  const navContent = `export const nav = ${JSON.stringify(nav, null, 2)}
`
  const clientNavPath = path.join(SRC, 'src', 'lib', `nav-${TARGET_CLIENT}.ts`)
  await fs.outputFile(clientNavPath, navContent)
  console.log(`• Navegación del cliente generada → src/lib/nav-${TARGET_CLIENT}.ts`)
}

async function applyBranding(config: BrandConfig) {
  // Actualizar Tailwind config
  const tailwindPath = path.join(SRC, 'tailwind.config.ts')
  const tailwindContent = await fs.readFile(tailwindPath, 'utf8')

  const updatedTailwind = tailwindContent.replace(
    /colors:\s*{\s*brand:\s*{\s*DEFAULT:\s*['"]#[0-9A-Fa-f]{6}['"][^}]*}\s*}/,
    `colors: { brand: { DEFAULT: '${config.secondaryColors.highlight}', accent: '${config.secondaryColors.accent}', hover: '${config.secondaryColors.hover}' } }`
  )

  await fs.outputFile(tailwindPath, updatedTailwind)

  // Actualizar variables CSS en colors.css
  const colorsPath = path.join(SRC, 'src', 'styles', 'colors.css')
  const colorsContent = await fs.readFile(colorsPath, 'utf8')

  let updatedColors = colorsContent
    .replace(/--color-brand:\s*#[0-9A-Fa-f]{6};/, `--color-brand: ${config.secondaryColors.highlight};`)
    .replace(/--color-brand-accent:\s*#[0-9A-Fa-f]{6};/, `--color-brand-accent: ${config.secondaryColors.accent};`)
    .replace(/--color-brand-hover:\s*#[0-9A-Fa-f]{6};/, `--color-brand-hover: ${config.secondaryColors.hover};`)

  await fs.outputFile(colorsPath, updatedColors)

  console.log(`• Colores de marca aplicados`)
  console.log(`  - highlight: ${config.secondaryColors.highlight}`)
  console.log(`  - accent: ${config.secondaryColors.accent}`)
  console.log(`  - hover: ${config.secondaryColors.hover}`)
}

function normaliseContentPath(file: string) {
  return file.replace(/\\/g, '/')
}

function toPlainText(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\(([^)]+)\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_\-~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function buildRouteMap(): Promise<RouteMap> {
  const routeMap: RouteMap = new Map()
  const clientAppDir = path.join(APP, TARGET_CLIENT)

  // Solo buscar páginas del cliente actual
  const pageFiles = globbySync('**/page.tsx', { cwd: clientAppDir })

  for (const rel of pageFiles) {
    // Construir ruta con prefijo del cliente
    const route =
      rel === 'page.tsx'
        ? `/${TARGET_CLIENT}`
        : `/${TARGET_CLIENT}/${rel.replace(/\/page\.tsx$/, '').replace(/\/index$/, '')}`

    const absolute = path.join(clientAppDir, rel)
    const source = await fs.readFile(absolute, 'utf8')
    const importMatch = source.match(/from\s+["']@\/content\/([^"']+)\/([^"']+)["']/)
    if (!importMatch) continue

    // El importMatch[1] es "partner-gym/30-seccion-3" y [2] es "Prueba textos.mdx"
    // Necesitamos construir el path completo relativo al CONTENT dir
    const sectionDir = importMatch[1].split('/').pop() || '' // "30-seccion-3"
    const fileName = importMatch[2].replace(/^\.\//, '') // "Prueba textos.mdx"
    const contentPath = `${sectionDir}/${fileName}` // "30-seccion-3/Prueba textos.mdx"

    const normalized = normaliseContentPath(contentPath)
    routeMap.set(normalized, route)
  }

  return routeMap
}

async function buildSearchIndex(routeMap: RouteMap) {
  const mdxFiles = globbySync('**/*.mdx', { cwd: CONTENT })
  const entries: Array<{ title: string; href: string; content: string; section?: string }> = []

  for (const rel of mdxFiles) {
    const absolute = path.join(CONTENT, rel)
    const raw = await fs.readFile(absolute, 'utf8')
    const parsed = matter(raw)
    const plain = toPlainText(parsed.content)
    if (!plain) continue

    // Obtener ruta desde routeMap o construir fallback slugificado
    let route = routeMap.get(normaliseContentPath(rel))

    if (!route) {
      // Construir ruta con slugs correctos para el fallback
      const pathParts = rel.replace(/\.mdx$/, '').split('/')
      const slugifiedParts = pathParts.map(part =>
        part === 'index' ? '' : slugify(part)
      ).filter(Boolean)
      route = `/${TARGET_CLIENT}/${slugifiedParts.join('/')}`
    }

    // Remover el prefijo del cliente de la ruta para que sea limpia
    const cleanRoute = route.replace(`/${TARGET_CLIENT}`, '').replace(/\/\/+/g, '/').replace(/\/$/, '') || '/'
    const section = cleanRoute === '/' ? 'inicio' : cleanRoute.slice(1).split('/')[0]

    // Extraer título del H1 o usar nombre de archivo limpio
    const h1Title = extractFirstH1(parsed.content)
    const fileName = rel.replace(/\.mdx$/, '').split('/').pop() || 'Documento'
    const cleanFileName = cleanNotionId(fileName)

    entries.push({
      title: (parsed.data?.title as string | undefined) || h1Title || cleanFileName,
      href: cleanRoute,
      content: plain.slice(0, 1200),
      section,
    })
  }

  const output = path.join(PUBLIC_DIR, 'search-index.json')
  await fs.ensureDir(PUBLIC_DIR)
  await fs.writeJson(output, entries, { spaces: 2 })
  console.log('• Índice de búsqueda → public/search-index.json')
}

async function copyPublicAssets() {
  if (!fs.existsSync(CLIENT_PUBLIC_SRC)) {
    console.log('⚠️  No se encontraron assets públicos para copiar')
    return
  }

  await fs.ensureDir(CLIENT_PUBLIC_DEST)
  await fs.copy(CLIENT_PUBLIC_SRC, CLIENT_PUBLIC_DEST, { overwrite: true })

  const files = await fs.readdir(CLIENT_PUBLIC_SRC)
  console.log(`• ${files.length} archivos copiados → public/${TARGET_CLIENT}/`)
}

async function generateComingSoonPage(clientName: string) {
  const appDir = path.join(APP, clientName)
  const pageFile = path.join(appDir, 'page.tsx')

  const pageContent = `export default function ComingSoonPage() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#fff',
      color: '#333',
      fontFamily: 'Manrope, sans-serif',
      fontSize: '2rem',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Próximamente
        </h1>
        <p style={{ fontSize: '1.5rem', opacity: 0.7 }}>
          ${clientName.charAt(0).toUpperCase() + clientName.slice(1)}
        </p>
      </div>
    </div>
  );
}
`

  await fs.ensureDir(appDir)
  await fs.outputFile(pageFile, pageContent)
  console.log(`• Página "Próximamente" generada → src/app/${clientName}/page.tsx`)
}

async function isClientEmpty(): Promise<boolean> {
  if (!fs.existsSync(SECTIONS_DIR)) {
    return true
  }

  const sections = await fs.readdir(SECTIONS_DIR)
  const validSections = sections.filter(s => {
    const sectionPath = path.join(SECTIONS_DIR, s)
    const stat = fs.statSync(sectionPath)
    return stat.isDirectory()
  })

  return validSections.length === 0
}

async function main() {
  await fs.ensureDir(CONTENT)

  console.log(`📦 Iniciando ingesta de contenido para cliente: ${TARGET_CLIENT}\n`)

  // Leer configuración de branding
  const brandConfig = await readBrandConfig()

  // Verificar si el cliente está vacío (sin secciones)
  const isEmpty = await isClientEmpty()

  if (isEmpty) {
    console.log('⚠️  Cliente sin contenido detectado. Generando página "Próximamente"...\n')

    // Copiar assets públicos del cliente (logo)
    console.log('🖼️  Copiando assets públicos...')
    await copyPublicAssets()

    // Generar página de "Próximamente"
    await generateComingSoonPage(TARGET_CLIENT)

    // Crear navegación vacía
    const emptyNav: NavItem[] = []
    await updateNavFile(emptyNav)

    // Aplicar branding si existe config
    if (brandConfig) {
      console.log('\n🎨 Aplicando branding...')
      await applyBranding(brandConfig)
    }

    console.log('\n✅ ¡Página "Próximamente" generada para cliente: ' + TARGET_CLIENT + '!\n')
    return
  }

  // Cliente con contenido - flujo normal
  // Copiar assets públicos del cliente
  console.log('🖼️  Copiando assets públicos...')
  await copyPublicAssets()

  // Importar secciones desde /import/clientes/{cliente}/sections
  console.log('\n📂 Importando secciones...')
  await importFromSections()

  console.log('\n📄 Generando páginas automáticas...')
  await generatePageFiles()

  console.log('\n🧭 Actualizando navegación...')
  const nav = await generateNavigation()
  await updateNavFile(nav)

  // Aplicar branding si existe config
  if (brandConfig) {
    console.log('\n🎨 Aplicando branding...')
    await applyBranding(brandConfig)
  }

  // Generación de índice de búsqueda
  const routes = await buildRouteMap()
  await buildSearchIndex(routes)

  console.log('\n✅ ¡Ingesta completada para cliente: ' + TARGET_CLIENT + '!\n')
}

main().catch(e => { console.error(e); process.exit(1) })
