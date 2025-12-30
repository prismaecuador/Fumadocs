// Este archivo exporta la navegación dinámica basada en el cliente actual
// La navegación específica de cada cliente se genera en nav-{cliente}.ts durante el ingest

type NavItem = {
  title: string;
  href: string;
  items?: NavItem[];
};

// Función para cargar navegación de un cliente específico
export function getNavForClient(clientName: string): NavItem[] {
  try {
    const navModule = require(`./nav-${clientName}`);
    return navModule.nav || [];
  } catch (error) {
    console.warn(`No navigation found for client: ${clientName}, using empty nav`);
    return [];
  }
}

// Export por defecto - carga partner-gym como fallback
// En producción, el layout debe usar getNavForClient() con el cliente detectado
let nav: NavItem[] = [];
try {
  const partnerGymNav = require('./nav-partner-gym');
  nav = partnerGymNav.nav || [];
} catch (e) {
  nav = [];
}

export { nav };
