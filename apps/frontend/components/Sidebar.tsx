'use client'

import { Button } from '@/components/ui/button'
import { X, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 shadow-xl transition-transform duration-300 ease-in-out',
          'bg-(--color-sidebar-bg)',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-sidebar-border p-4">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-sidebar-text">
              Menu
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-sidebar-text hover:bg-sidebar-hover"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/demand"
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200',
                    pathname === '/demand'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-sidebar-text hover:bg-sidebar-hover hover:shadow-sm',
                  )}
                >
                  Demandas
                </Link>
              </li>
            </ul>
          </nav>
          <div className="border-t border-sidebar-border p-4">
            <Button
              type="button"
              variant="ghost"
              onClick={toggleTheme}
              className={cn(
                'group relative w-full justify-start gap-3 overflow-hidden',
                'text-sidebar-text hover:bg-sidebar-hover',
                'transition-all duration-200',
              )}
              disabled={!mounted}
            >
              <div className="flex items-center gap-3">
                <div className="relative h-5 w-5">
                  {mounted && theme === 'dark' ? (
                    <Sun className="h-5 w-5 rotate-0 transition-transform duration-300 group-hover:rotate-180" />
                  ) : (
                    <Moon className="h-5 w-5 rotate-0 transition-transform duration-300 group-hover:-rotate-12" />
                  )}
                </div>
                <span className="font-medium">
                  {mounted && theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
