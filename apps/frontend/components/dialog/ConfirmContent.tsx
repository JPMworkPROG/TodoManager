'use client'

import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type ConfirmContentProps = {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'default' | 'destructive'
  isLoading?: boolean
}

export function ConfirmContent({
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'default',
  isLoading = false,
}: ConfirmContentProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={variant}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Processando...' : confirmText}
        </Button>
      </DialogFooter>
    </>
  )
}

export default ConfirmContent
