#!/bin/bash

# Script para agregar un nuevo cliente a Fumadocs
# Uso: ./scripts/add-client.sh nombre-cliente "Nombre Completo" color-principal

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función de ayuda
show_help() {
    echo -e "${BLUE}=== Fumadocs - Agregar Nuevo Cliente ===${NC}\n"
    echo "Uso: ./scripts/add-client.sh [opciones]"
    echo ""
    echo "Opciones:"
    echo "  -n, --name          Nombre del cliente (slug, ej: partner-gym)"
    echo "  -f, --full-name     Nombre completo (ej: 'Partner Gym')"
    echo "  -c, --color         Color principal en hex (ej: #FF5733)"
    echo "  -h, --help          Mostrar esta ayuda"
    echo ""
    echo "Ejemplo:"
    echo "  ./scripts/add-client.sh -n acme -f 'ACME Corp' -c '#FF5733'"
    echo ""
}

# Parsear argumentos
CLIENT_NAME=""
FULL_NAME=""
COLOR="#007AFF"

while [[ $# -gt 0 ]]; do
    case $1 in
        -n|--name)
            CLIENT_NAME="$2"
            shift 2
            ;;
        -f|--full-name)
            FULL_NAME="$2"
            shift 2
            ;;
        -c|--color)
            COLOR="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${YELLOW}Argumento desconocido: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Validar que se proporcionó el nombre
if [ -z "$CLIENT_NAME" ]; then
    echo -e "${YELLOW}Error: Debes proporcionar el nombre del cliente${NC}\n"
    show_help
    exit 1
fi

# Si no se proporciona nombre completo, usar el slug capitalizado
if [ -z "$FULL_NAME" ]; then
    FULL_NAME="${CLIENT_NAME^}"
fi

echo -e "${BLUE}=== Creando nuevo cliente ===${NC}"
echo -e "Nombre: ${GREEN}$CLIENT_NAME${NC}"
echo -e "Nombre completo: ${GREEN}$FULL_NAME${NC}"
echo -e "Color: ${GREEN}$COLOR${NC}"
echo ""

# Crear estructura de directorios
CLIENT_DIR="import/clientes/$CLIENT_NAME"

if [ -d "$CLIENT_DIR" ]; then
    echo -e "${YELLOW}Advertencia: El cliente '$CLIENT_NAME' ya existe${NC}"
    read -p "¿Deseas sobrescribir? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Operación cancelada"
        exit 1
    fi
fi

echo -e "${BLUE}[1/6]${NC} Creando estructura de directorios..."
mkdir -p "$CLIENT_DIR/sections/Sección 1"
mkdir -p "$CLIENT_DIR/public"

# Crear config.json
echo -e "${BLUE}[2/6]${NC} Creando config.json..."
cat > "$CLIENT_DIR/config.json" << EOF
{
  "projectName": "$FULL_NAME",
  "domain": "$CLIENT_NAME.helloprisma.com",
  "secondaryColors": {
    "highlight": "$COLOR",
    "accent": "#EFEFEF",
    "hover": "#CCCCCC"
  }
}
EOF

# Crear archivo de ejemplo
echo -e "${BLUE}[3/6]${NC} Creando contenido de ejemplo..."
cat > "$CLIENT_DIR/sections/Sección 1/Bienvenida.md" << 'EOF'
# Bienvenida

¡Bienvenido a la documentación de tu proyecto!

## Primeros Pasos

Esta es una página de ejemplo. Puedes:

- Editar este archivo Markdown
- Agregar más secciones
- Incluir imágenes
- Personalizar los colores

## Estructura

Organiza tu contenido en secciones:

```
import/clientes/tu-cliente/
├── sections/
│   ├── Sección 1/
│   │   └── Página 1.md
│   ├── Sección 2/
│   │   └── Página 2.md
│   └── ...
├── public/
│   └── logo.svg
└── config.json
```

## Siguiente Paso

1. Agrega tu logo en `public/logo.svg`
2. Ejecuta `pnpm ingest` para generar el sitio
3. Sube a Vercel y configura el DNS

¡Listo! 🚀
EOF

# Crear logo placeholder
echo -e "${BLUE}[4/6]${NC} Creando logo placeholder..."
cat > "$CLIENT_DIR/public/logo.svg" << 'EOF'
<svg width="140" height="48" viewBox="0 0 140 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="140" height="48" rx="8" fill="#007AFF"/>
  <text x="70" y="28" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">LOGO</text>
</svg>
EOF

# Mostrar siguiente pasos
echo -e "\n${GREEN}✓ Cliente creado exitosamente!${NC}\n"
echo -e "${BLUE}Siguiente pasos:${NC}"
echo ""
echo -e "1. ${YELLOW}Personaliza el contenido:${NC}"
echo -e "   cd $CLIENT_DIR/sections"
echo ""
echo -e "2. ${YELLOW}Reemplaza el logo:${NC}"
echo -e "   cp /ruta/a/tu/logo.svg $CLIENT_DIR/public/logo.svg"
echo ""
echo -e "3. ${YELLOW}Genera el sitio:${NC}"
echo -e "   CLIENT_NAME=$CLIENT_NAME pnpm ingest"
echo ""
echo -e "4. ${YELLOW}Configura el DNS en Hostinger:${NC}"
echo -e "   Tipo: CNAME"
echo -e "   Nombre: $CLIENT_NAME"
echo -e "   Valor: cname.vercel-dns.com"
echo ""
echo -e "5. ${YELLOW}Agrega el dominio en Vercel:${NC}"
echo -e "   $CLIENT_NAME.helloprisma.com"
echo ""
echo -e "6. ${YELLOW}Deploy:${NC}"
echo -e "   git add . && git commit -m 'feat: Add $CLIENT_NAME' && git push"
echo ""
echo -e "${GREEN}Documentación completa en: DEPLOYMENT.md${NC}\n"
