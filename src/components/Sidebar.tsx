'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/reportes', label: 'Reportes' },
  { href: '/alertas', label: 'Alertas' },
  { href: '/mapa', label: 'Mapa' },
]

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="w-60 h-full bg-gray-800 text-white flex flex-col py-6 px-4 gap-2 shadow-lg">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
        Menu principal
      </p>

      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            pathname === item.href
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  )
}

export default Sidebar
