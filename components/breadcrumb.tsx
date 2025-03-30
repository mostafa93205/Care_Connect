import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface BreadcrumbProps {
  items: { href: string; label: string }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />}
            <Link
              href={item.href}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

