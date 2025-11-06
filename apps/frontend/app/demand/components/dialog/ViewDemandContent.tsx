'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Edit2, Plus, Save, X, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useCreateDemandItem,
  useUpdateDemandItem,
  useDeleteDemandItem,
  useDeleteDemand,
  type DemandStatus,
} from '../../../hooks/useDemands'
import type { Demand, DemandItem } from '../../../api/demands'
import { formatDate } from '@/lib/utils'
import { BaseDialog } from '@/components/dialog/BaseDialog'
import { ConfirmContent } from '@/components/dialog/ConfirmContent'

type ItemCreateForm = { description: string; plannedTotalTons: string }
type ItemEditForm = {
  description: string
  plannedTotalTons: string
  producedTotalTons: string
}

type ViewDemandContentProps = {
  demand: Demand
  onClose: () => void
  onEditMode: () => void
}

const statusStyles: Record<DemandStatus, string> = {
  planning:
    'bg-[#F6CED8] text-black border-[#8C3F57] dark:bg-[#F6CED8] dark:text-black dark:border-[#8C3F57]',
  in_progress:
    'bg-[#CAE1F7] text-black border-[#0D4B80] dark:bg-[#CAE1F7] dark:text-black dark:border-[#0D4B80]',
  completed:
    'bg-[#CFEBC7] text-black border-[#1D5A2B] dark:bg-[#CFEBC7] dark:text-black dark:border-[#1D5A2B]',
}

const statusLabels: Record<DemandStatus, string> = {
  planning: 'Planejamento',
  in_progress: 'Em andamento',
  completed: 'Concluído',
}

const numberFormatter = new Intl.NumberFormat('pt-BR')

export function ViewDemandContent({
  demand,
  onClose,
  onEditMode,
}: ViewDemandContentProps) {
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [showDeleteItemDialog, setShowDeleteItemDialog] = useState(false)
  const [showDeleteDemandDialog, setShowDeleteDemandDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)

  const createDemandItemMutation = useCreateDemandItem()
  const updateDemandItemMutation = useUpdateDemandItem()
  const deleteDemandItemMutation = useDeleteDemandItem()
  const deleteDemandMutation = useDeleteDemand()

  const {
    register: registerItem,
    handleSubmit: handleSubmitItem,
    reset: resetItem,
    formState: { errors: errorsItem },
  } = useForm<ItemCreateForm>({
    defaultValues: { description: '', plannedTotalTons: '' },
  })

  const {
    register: registerEditItem,
    handleSubmit: handleSubmitEditItem,
    reset: resetEditItem,
    setValue: setValueEditItem,
    formState: { errors: errorsEditItem },
  } = useForm<ItemEditForm>({
    defaultValues: {
      description: '',
      plannedTotalTons: '',
      producedTotalTons: '',
    },
  })

  const handleAddItem = async (data: ItemCreateForm) => {
    createDemandItemMutation.mutate(
      {
        demandId: demand.id,
        payload: {
          description: data.description,
          plannedTotalTons: parseFloat(data.plannedTotalTons) || 0,
        },
      },
      {
        onSuccess: () => {
          setIsAddingItem(false)
          resetItem()
        },
      },
    )
  }

  const handleEditItem = (item: DemandItem) => {
    setEditingItemId(item.sku)
    setValueEditItem('description', item.description)
    setValueEditItem('plannedTotalTons', item.plannedTotalTons.toString())
    setValueEditItem(
      'producedTotalTons',
      item.producedTotalTons?.toString() || '',
    )
  }

  const handleSaveItem = async (data: ItemEditForm) => {
    if (!editingItemId) return
    updateDemandItemMutation.mutate(
      {
        demandId: demand.id,
        itemId: editingItemId,
        payload: {
          description: data.description,
          plannedTotalTons: parseFloat(data.plannedTotalTons) || undefined,
          producedTotalTons: data.producedTotalTons
            ? parseFloat(data.producedTotalTons)
            : undefined,
        },
      },
      {
        onSuccess: () => {
          setEditingItemId(null)
          resetEditItem()
        },
      },
    )
  }

  const handleCancelEditItem = () => {
    setEditingItemId(null)
    resetEditItem()
  }

  const handleDeleteItemClick = (itemId: number) => {
    setItemToDelete(itemId)
    setShowDeleteItemDialog(true)
  }

  const handleDeleteItemConfirm = () => {
    if (itemToDelete !== null) {
      deleteDemandItemMutation.mutate(
        { demandId: demand.id, itemId: itemToDelete },
        {
          onSuccess: () => {
            setItemToDelete(null)
            setShowDeleteItemDialog(false)
          },
        },
      )
    }
  }

  const handleDeleteDemandClick = () => {
    setShowDeleteDemandDialog(true)
  }

  const handleDeleteDemandConfirm = () => {
    deleteDemandMutation.mutate(demand.id, {
      onSuccess: () => {
        setShowDeleteDemandDialog(false)
        onClose()
      },
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{demand.title}</DialogTitle>
        {demand.description && (
          <DialogDescription className="whitespace-pre-wrap">
            {demand.description}
          </DialogDescription>
        )}
      </DialogHeader>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge
                className={`rounded-md px-3 py-1 text-[0.7rem] font-semibold whitespace-nowrap transition-all duration-200 border ${statusStyles[demand.status]}`}
              >
                {statusLabels[demand.status]}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {formatDate(demand.startDate)} - {formatDate(demand.endDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Itens</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingItem(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto border rounded-md">
            {isAddingItem && (
              <div className="p-3 border-b bg-muted/50">
                <form
                  onSubmit={handleSubmitItem(handleAddItem)}
                  className="flex gap-2"
                >
                  <Input
                    className="flex-1"
                    placeholder="Descrição"
                    {...registerItem('description', { required: true })}
                  />
                  <Input
                    className="w-28"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Tons"
                    {...registerItem('plannedTotalTons', {
                      required: true,
                      min: 0,
                    })}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    disabled={createDemandItemMutation.isPending}
                  >
                    <Save className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setIsAddingItem(false)
                      resetItem()
                    }}
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </form>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">SKU</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-40 text-right">
                    Total Plan (tons)
                  </TableHead>
                  <TableHead className="w-44 text-right">
                    Total Produ (tons)
                  </TableHead>
                  <TableHead className="w-24 text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demand.items.map((item) =>
                  editingItemId === item.sku ? (
                    <TableRow key={item.sku}>
                      <TableCell className="align-top">
                        <span className="text-xs text-muted-foreground">
                          {item.sku}
                        </span>
                      </TableCell>
                      <TableCell colSpan={4} className="align-top">
                        <form
                          onSubmit={handleSubmitEditItem(handleSaveItem)}
                          className="flex gap-2 items-start"
                        >
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="Descrição do item"
                              {...registerEditItem('description', {
                                required: 'Descrição é obrigatória',
                              })}
                            />
                            {errorsEditItem.description && (
                              <p className="text-xs text-red-500">
                                {errorsEditItem.description.message}
                              </p>
                            )}
                          </div>
                          <div className="w-28">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Planejado (ton)"
                              {...registerEditItem('plannedTotalTons', {
                                required: 'Quantidade planejada é obrigatória',
                                min: {
                                  value: 0,
                                  message: 'Deve ser maior ou igual a 0',
                                },
                              })}
                            />
                          </div>
                          <div className="w-28">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Produzido (ton)"
                              {...registerEditItem('producedTotalTons')}
                            />
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="submit"
                              size="icon"
                              variant="ghost"
                              disabled={updateDemandItemMutation.isPending}
                              className="h-9 w-9"
                            >
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={handleCancelEditItem}
                              className="h-9 w-9"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </form>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={item.sku}>
                      <TableCell className="font-mono text-xs">
                        {item.sku}
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {numberFormatter.format(item.plannedTotalTons)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {numberFormatter.format(item.producedTotalTons ?? 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditItem(item)}
                            className="h-8 w-8"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteItemClick(item.sku)}
                            className="h-8 w-8"
                            disabled={deleteDemandItemMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
          {(createDemandItemMutation.isError ||
            updateDemandItemMutation.isError ||
            deleteDemandItemMutation.isError) && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-sm text-red-600 dark:text-red-400">
              {createDemandItemMutation.error instanceof Error
                ? createDemandItemMutation.error.message
                : updateDemandItemMutation.error instanceof Error
                  ? updateDemandItemMutation.error.message
                  : deleteDemandItemMutation.error instanceof Error
                    ? deleteDemandItemMutation.error.message
                    : 'Erro ao processar item'}
            </div>
          )}
        </div>

        {deleteDemandMutation.isError && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-sm text-red-600 dark:text-red-400">
            {deleteDemandMutation.error instanceof Error
              ? deleteDemandMutation.error.message
              : 'Erro ao deletar demanda'}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteDemandClick}
            disabled={deleteDemandMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Deletar Demanda
          </Button>
          <div className="flex-1" />
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button type="button" onClick={onEditMode}>
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </DialogFooter>
      </div>

      <BaseDialog
        open={showDeleteItemDialog}
        onOpenChange={setShowDeleteItemDialog}
      >
        <ConfirmContent
          title="Deletar Item"
          description="Tem certeza que deseja deletar este item? Esta ação não pode ser desfeita."
          confirmText="Deletar"
          cancelText="Cancelar"
          onConfirm={handleDeleteItemConfirm}
          onCancel={() => setShowDeleteItemDialog(false)}
          variant="destructive"
          isLoading={deleteDemandItemMutation.isPending}
        />
      </BaseDialog>

      <BaseDialog
        open={showDeleteDemandDialog}
        onOpenChange={setShowDeleteDemandDialog}
      >
        <ConfirmContent
          title="Deletar Demanda"
          description={`Tem certeza que deseja deletar a demanda "${demand.title}"? Esta ação não pode ser desfeita e todos os itens associados serão removidos.`}
          confirmText="Deletar"
          cancelText="Cancelar"
          onConfirm={handleDeleteDemandConfirm}
          onCancel={() => setShowDeleteDemandDialog(false)}
          variant="destructive"
          isLoading={deleteDemandMutation.isPending}
        />
      </BaseDialog>
    </>
  )
}

export default ViewDemandContent
