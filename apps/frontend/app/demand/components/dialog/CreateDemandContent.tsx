'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCreateDemand,
  type DemandStatus,
  type CreateDemandPayload,
} from '../../../hooks/useDemands'

type DemandFormData = {
  title: string
  description: string
  status: DemandStatus
  startDate: string
  endDate: string
  items: Array<{ description: string; plannedTotalTons: string }>
}

type CreateDemandContentProps = {
  onClose: () => void
  onCreated?: () => void
}

export function CreateDemandContent({
  onClose,
  onCreated,
}: CreateDemandContentProps) {
  const createDemandMutation = useCreateDemand()

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DemandFormData>({
    defaultValues: {
      title: '',
      description: '',
      status: 'planning' as DemandStatus,
      startDate: '',
      endDate: '',
      items: [{ description: '', plannedTotalTons: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const onSubmit = (data: DemandFormData) => {
    const items = data.items
      .filter((item) => item.description.trim() && item.plannedTotalTons)
      .map((item) => ({
        description: item.description,
        plannedTotalTons: parseInt(item.plannedTotalTons),
      }))

    if (items.length === 0) return

    createDemandMutation.mutate(
      { ...data, items },
      {
        onSuccess: () => {
          onClose()
          onCreated?.()
        },
      },
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Nova Demanda</DialogTitle>
        <DialogDescription>
          Preencha os dados para criar uma nova demanda de produção.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register('title', { required: 'Título é obrigatório' })}
              placeholder="Ex: Q1/2025 Demand"
              maxLength={140}
              className="placeholder:opacity-50"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={watch('status')}
              onValueChange={(v) => setValue('status', v as DemandStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planejamento</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição *</Label>
          <Textarea
            id="description"
            {...register('description', {
              required: 'Descrição é obrigatória',
            })}
            placeholder="Descrição detalhada da demanda"
            rows={3}
            className="placeholder:opacity-50"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data de Início *</Label>
            <Input
              id="startDate"
              type="date"
              {...register('startDate', {
                required: 'Data de início é obrigatória',
              })}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Data de Término *</Label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate', {
                required: 'Data de término é obrigatória',
                validate: (value) =>
                  value >= watch('startDate') ||
                  'Data de término deve ser maior ou igual à data de início',
              })}
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Itens *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ description: '', plannedTotalTons: '' })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                className="flex-1 placeholder:opacity-50"
                placeholder="Descrição do item"
                {...register(`items.${index}.description`, { required: true })}
              />
              <Input
                className="w-32 placeholder:opacity-50"
                type="number"
                step="0.01"
                min="0"
                placeholder="Toneladas"
                {...register(`items.${index}.plannedTotalTons`, {
                  required: true,
                  min: 0,
                })}
              />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {createDemandMutation.isError && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-sm text-red-600 dark:text-red-400">
            {createDemandMutation.error instanceof Error
              ? createDemandMutation.error.message
              : 'Erro ao criar demanda'}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={createDemandMutation.isPending}>
            {createDemandMutation.isPending ? 'Criando...' : 'Criar'}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export default CreateDemandContent
