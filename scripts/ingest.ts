import fs from 'fs-extra'
import path from 'path'
import matter from 'gray-matter'

const SRC = process.cwd()
const CONTENT = path.join(SRC, 'src', 'content')

async function copyREADME() {
  const f = ['README.md', 'readme.md'].map(p => path.join(SRC, p)).find(fs.existsSync)
  if (!f) return
  const raw = await fs.readFile(f, 'utf8')
  const out = matter.stringify(raw, { title: 'Introducción' })
  await fs.outputFile(path.join(CONTENT, '00-intro.mdx'), out)
  console.log('• README → src/content/00-intro.mdx')
}

async function openapiToMDX() {
  const f = ['openapi.yaml','openapi.yml','openapi.json'].map(p => path.join(SRC, p)).find(fs.existsSync)
  if (!f) return
  const raw = await fs.readFile(f, 'utf8')
  const mdx = matter.stringify(`\n# Referencia OpenAPI\n\n<pre>\n${raw}\n</pre>\n`, { title: 'API (OpenAPI)' })
  await fs.outputFile(path.join(CONTENT, '20-api', 'index.mdx'), mdx)
  console.log('• OpenAPI → src/content/20-api/index.mdx')
}

async function graphqlToMDX() {
  const f = ['schema.graphql','schema.gql'].map(p => path.join(SRC, p)).find(fs.existsSync)
  if (!f) return
  const raw = await fs.readFile(f, 'utf8')
  const mdx = matter.stringify(`\n# Esquema GraphQL\n\n<pre>\n${raw}\n</pre>\n`, { title: 'API (GraphQL)' })
  const target = path.join(CONTENT, '20-api', 'graphql.mdx')
  await fs.outputFile(target, mdx)
  console.log('• GraphQL → src/content/20-api/graphql.mdx')
}

async function changelogToMDX() {
  const f = ['CHANGELOG.md', 'changelog.md'].map(p => path.join(SRC, p)).find(fs.existsSync)
  if (!f) return
  const raw = await fs.readFile(f, 'utf8')
  const out = matter.stringify(raw, { title: 'Changelog' })
  await fs.outputFile(path.join(CONTENT, '99-changelog.mdx'), out)
  console.log('• CHANGELOG → src/content/99-changelog.mdx')
}

async function main() {
  await fs.ensureDir(CONTENT)
  await fs.ensureDir(path.join(CONTENT, '20-api'))
  await copyREADME()
  await openapiToMDX()
  await graphqlToMDX()
  await changelogToMDX()
}

main().catch(e => { console.error(e); process.exit(1) })
