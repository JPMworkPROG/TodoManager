'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Sidebar } from './Sidebar'

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <header className="bg-(--color-header-bg) text-(--color-header-text) shadow-md transition-colors duration-300">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
            aria-label="Abrir menu"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-semibold uppercase tracking-[0.35em]">
              SMI
            </span>
            <span className="text-xs uppercase tracking-[0.5em] text-white/70">
              Engineering
            </span>
          </div>
          <div className="ml-auto">
            <Avatar className="border border-white/30 bg-primary text-primary-foreground">
              <AvatarFallback className="text-sm font-semibold uppercase tracking-wide">
                LM
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}
