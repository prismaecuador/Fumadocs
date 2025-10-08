#!/usr/bin/env tsx
import fs from 'fs-extra'
import path from 'path'

const args = Object.fromEntries(process.argv.slice(2).map(k => k.split('=')))
const project = args.project || 'acme'
const domain  = args.domain  || `${project}.docs.local`
const color   = args.color   || '#E11D48'

const TOKENS: Record<string,string> = {
  '__PROJECT_NAME__': project,
  '__DOMAIN__': domain,
  '__BRAND_COLOR__': color,
}

function replaceTokensInFile(file: string) {
  let text = fs.readFileSync(file, 'utf8')
  for (const [k,v] of Object.entries(TOKENS)) text = text.replaceAll(k, v)
  fs.writeFileSync(file, text)
}

function replaceTokensRecursively(dir: string) {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) replaceTokensRecursively(p)
    else if (/\.(ts|tsx|mdx|json|mjs|css)$/i.test(p)) replaceTokensInFile(p)
  }
}

async function main() {
  console.log('>> Aplicando tokens de marca y dominio…')
  replaceTokensRecursively(path.join(process.cwd(), 'src'))
  replaceTokensRecursively(path.join(process.cwd()))
  await fs.ensureFile(path.join('src','content','00-intro.mdx'))
  await fs.ensureDir(path.join('src','content','20-api'))
  await fs.ensureDir(path.join('src','content','90-guias'))
  console.log('✔ Listo. Edita src/content/* y src/lib/nav.ts')
}

main().catch((e) => { console.error(e); process.exit(1) })
