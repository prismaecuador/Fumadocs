import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirigir al primer cliente disponible
  // En producción, esto no se usará porque el middleware detecta el subdominio
  // En desarrollo, redirige al primer cliente
  redirect('/partner-gym')
}
