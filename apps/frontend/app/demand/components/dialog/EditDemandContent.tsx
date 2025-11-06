'use client'

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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdateDemand, type DemandStatus } from '../../../hooks/useDemands'
import type { Demand } from '../../../api/demands'

type UpdateDemandFormData = {
  title: string
  description: string
  status: DemandStatus
  startDate: string
  endDate: string
}

type EditDemandContentProps = {
  demand: Demand
  onCancel: () => void
  onSuccess: () => void
}

export function EditDemandContent({
  demand,
  onCancel,
  onSuccess,
}: EditDemandContentProps) {
  const updateDemandMutation = useUpdateDemand()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateDemandFormData>({
    defaultValues: {
      title: demand.title,
      description: demand.description,
      status: demand.status,
      startDate: demand.startDate,
      endDate: demand.endDate,
    },
  })

  const onSubmit = (data: UpdateDemandFormData) => {
    updateDemandMutation.mutate(
      { demandId: demand.id, payload: data },
      { onSuccess },
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar Demanda</DialogTitle>
        <DialogDescription>Atualize os dados da demanda.</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input {...register('title', { required: true })} maxLength={140} />
          </div>
          <div className="space-y-2">
            <Label>Status *</Label>
            <Select
              value={watch('status')}
              onValueChange={(v) => setValue('status', v as DemandStatus)}
            >
              <SelectTrigger>
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
          <Label>Descrição *</Label>
          <Textarea {...register('description', { required: true })} rows={3} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data de Início *</Label>
            <Input
              type="date"
              {...register('startDate', {
                required: true,
                validate: (v) => {
                  const endDateValue = watch('endDate')
                  return (
                    !endDateValue ||
                    v <= endDateValue ||
                    'Data de início deve ser menor ou igual à data de término'
                  )
                },
              })}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Data de Término *</Label>
            <Input
              type="date"
              {...register('endDate', {
                required: true,
                validate: (v) => {
                  const startDateValue = watch('startDate')
                  return (
                    !startDateValue ||
                    v >= startDateValue ||
                    'Data de término deve ser maior ou igual à data de início'
                  )
                },
              })}
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {updateDemandMutation.isError && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-sm text-red-600 dark:text-red-400">
            {updateDemandMutation.error instanceof Error
              ? updateDemandMutation.error.message
              : 'Erro ao atualizar'}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={updateDemandMutation.isPending}>
            {updateDemandMutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export default EditDemandContent
