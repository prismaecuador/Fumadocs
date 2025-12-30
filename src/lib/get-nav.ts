type NavItem = {
  title: string;
  href: string;
  items?: NavItem[];
};

export function getNavForClient(clientName: string): NavItem[] {
  try {
    // Intentar cargar la navegación específica del cliente
    const navModule = require(`./nav-${clientName}`);
    return navModule.nav || [];
  } catch (error) {
    // Si no existe navegación para este cliente, retornar array vacío
    console.warn(`No navigation found for client: ${clientName}`);
    return [];
  }
}
