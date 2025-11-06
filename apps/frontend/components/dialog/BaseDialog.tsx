'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ReactNode } from 'react'

type BaseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  maxWidth?: '2xl' | '5xl'
}

const maxWidthClasses = {
  '2xl': 'max-w-2xl',
  '5xl': 'max-w-5xl',
}

export function BaseDialog({
  open,
  onOpenChange,
  children,
  maxWidth = '2xl',
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${maxWidthClasses[maxWidth]} max-h-[95vh] overflow-y-auto`}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default BaseDialog
