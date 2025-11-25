import fs from 'fs-extra'
import path from 'path'
import { globbySync } from 'globby'
import matter from 'gray-matter'

const SRC = process.cwd()
const CONTENT = path.join(SRC, 'src', 'content')
const APP = path.join(SRC, 'src', 'app')
const PUBLIC_DIR = path.join(SRC, 'public')
const IMPORT_DIR = path.join(SRC, 'import')
const SECTIONS_DIR = path.join(IMPORT_DIR, 'sections')
const CONFIG_FILE = path.join(IMPORT_DIR, 'config.json')

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


async function readBrandConfig(): Promise<BrandConfig | null> {
  if (!fs.existsSync(CONFIG_FILE)) return null
  const config = await fs.readJson(CONFIG_FILE)
  return config as BrandConfig
}

async function importFromSections() {
  if (!fs.existsSync(SECTIONS_DIR)) return

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

    const sectionContentDir = path.join(CONTENT, `${sectionNumber.toString().padStart(2, '0')}-${sectionName}`)
    await fs.ensureDir(sectionContentDir)

    for (const mdFile of markdownFiles) {
      const mdPath = path.join(sectionPath, mdFile)
      const raw = await fs.readFile(mdPath, 'utf8')

      const parsed = matter(raw)
      const title = parsed.data?.title || mdFile.replace(/\.(md|mdx)$/, '')

      const frontmatter = { ...parsed.data, title }
      const mdxContent = matter.stringify(parsed.content, frontmatter)

      const mdxFileName = mdFile.replace(/\.md$/, '.mdx')
      const mdxPath = path.join(sectionContentDir, mdxFileName)

      await fs.outputFile(mdxPath, mdxContent)
      console.log(`• ${sectionName}/${mdFile} → src/content/${path.basename(sectionContentDir)}/${mdxFileName}`)
    }

    sectionNumber += 10
  }
}

async function generatePageFiles() {
  const contentDirs = await fs.readdir(CONTENT)

  for (const dir of contentDirs) {
    const dirPath = path.join(CONTENT, dir)
    const stat = await fs.stat(dirPath)

    if (!stat.isDirectory()) continue

    const sectionName = dir.replace(/^\d+-/, '')
    const appDir = path.join(APP, sectionName)
    const pageFile = path.join(appDir, 'page.tsx')

    if (fs.existsSync(pageFile)) continue

    await fs.ensureDir(appDir)

    const mdxFiles = await fs.readdir(dirPath)
    const indexFile = mdxFiles.find(f => f === 'index.mdx' || f === 'index.md')

    if (!indexFile) {
      const firstMd = mdxFiles.find(f => f.endsWith('.mdx') || f.endsWith('.md'))
      if (!firstMd) continue
    }

    const importName = indexFile ? 'Index' : mdxFiles.find(f => f.endsWith('.mdx') || f.endsWith('.md'))?.replace(/\.(mdx|md)$/, '')
    const contentPath = `@/content/${dir}/${indexFile || ''}`

    const pageContent = `"use client";

import MDX from "${contentPath}";

export default function Page() {
  return <MDX />;
}
`

    await fs.outputFile(pageFile, pageContent)
    console.log(`• Página generada → src/app/${sectionName}/page.tsx`)
  }
}

async function generateNavigation(): Promise<Array<{ title: string; href: string }>> {
  const nav: Array<{ title: string; href: string }> = []

  const contentDirs = await fs.readdir(CONTENT)
  const sortedDirs = contentDirs.sort()

  for (const dir of sortedDirs) {
    const dirPath = path.join(CONTENT, dir)
    const stat = await fs.stat(dirPath)

    if (!stat.isDirectory()) continue

    const indexPath = path.join(dirPath, 'index.mdx')
    if (!fs.existsSync(indexPath)) continue

    const indexContent = await fs.readFile(indexPath, 'utf8')
    const parsed = matter(indexContent)
    const title = (parsed.data?.title as string) || dir.replace(/^\d+-/, '').replace(/-/g, ' ')
    const href = '/' + dir.replace(/^\d+-/, '')

    nav.push({ title, href })
  }

  return nav
}

async function updateNavFile(nav: Array<{ title: string; href: string }>) {
  const navContent = `export const nav = ${JSON.stringify(nav, null, 2 )}
`
  await fs.outputFile(path.join(SRC, 'src', 'lib', 'nav.ts'), navContent)
  console.log('• Navegación actualizada → src/lib/nav.ts')
}

async function applyBranding(config: BrandConfig) {
  const tailwindPath = path.join(SRC, 'tailwind.config.ts')
  const tailwindContent = await fs.readFile(tailwindPath, 'utf8')

  // Reemplazar color secundario highlight
  const updatedContent = tailwindContent.replace(
    /colors:\s*{\s*brand:\s*{\s*DEFAULT:\s*['"]#[0-9A-Fa-f]{6}['"][^}]*}\s*}/,
    `colors: { brand: { DEFAULT: '${config.secondaryColors.highlight}', accent: '${config.secondaryColors.accent}', hover: '${config.secondaryColors.hover}' } }`
  )

  await fs.outputFile(tailwindPath, updatedContent)
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
  const pageFiles = globbySync('**/page.tsx', { cwd: APP })

  for (const rel of pageFiles) {
    const route =
      rel === 'page.tsx'
        ? '/'
        : `/${rel.replace(/\/page\.tsx$/, '').replace(/\/index$/, '')}`
    const absolute = path.join(APP, rel)
    const source = await fs.readFile(absolute, 'utf8')
    const importMatch = source.match(/from\s+["']@\/content\/([^"']+)["']/)
    if (!importMatch) continue
    const contentPath = importMatch[1].replace(/^\.\//, '')
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

    const route =
      routeMap.get(normaliseContentPath(rel)) ||
      `/${rel.replace(/\.mdx$/, '').replace(/index$/, '').replace(/\/+/g, '/')}`

    const cleanRoute = route.replace(/\/\/+/g, '/').replace(/\/$/, '') || '/'
    const section = cleanRoute === '/' ? 'inicio' : cleanRoute.slice(1).split('/')[0]

    entries.push({
      title:
        (parsed.data?.title as string | undefined) ||
        rel.replace(/\.mdx$/, '').split('/').pop() ||
        'Documento',
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

async function main() {
  await fs.ensureDir(CONTENT)

  console.log('📦 Iniciando ingesta de contenido...\n')

  // Leer configuración de branding
  const brandConfig = await readBrandConfig()

  // Importar secciones desde /import/sections
  console.log('📂 Importando secciones desde /import/sections...')
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

  console.log('\n✅ ¡Ingesta completada!\n')
}

main().catch(e => { console.error(e); process.exit(1) })
