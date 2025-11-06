'use client'

import { useForm, useFieldArray } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateDemand, type DemandStatus, type CreateDemandPayload } from "../../hooks/useDemands"

type DemandFormData = {
   title: string
   description: string
   status: DemandStatus
   startDate: string
   endDate: string
   items: Array<{ description: string; plannedTotalTons: string }>
}

type CreateDemandDialogProps = {
   open: boolean
   onOpenChange: (open: boolean) => void
   onCreated?: () => void
}

export function CreateDemandDialog({ open, onOpenChange, onCreated }: CreateDemandDialogProps) {
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

   const onSubmit = async (data: DemandFormData) => {
      if (data.items.length === 0) return

      const payload: CreateDemandPayload = {
         title: data.title,
         description: data.description,
         status: data.status,
         startDate: data.startDate,
         endDate: data.endDate,
         items: data.items
            .filter(item => item.description.trim() && item.plannedTotalTons)
            .map(item => ({
               description: item.description,
               plannedTotalTons: parseFloat(String(item.plannedTotalTons)) || 0,
            })),
      }

      if (payload.items.length === 0) return

      createDemandMutation.mutate(payload, {
         onSuccess: () => {
            onOpenChange(false)
            reset()
            onCreated?.()
         },
      })
   }

   return (
      <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { reset(); createDemandMutation.reset() } }}>
         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>Nova Demanda</DialogTitle>
               <DialogDescription>
                  Preencha os dados para criar uma nova demanda de produção.
               </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="title">
                        Título <span className="text-red-500">*</span>
                     </Label>
                     <Input
                        id="title"
                        {...register('title', { required: 'Título é obrigatório' })}
                        placeholder="Ex: Q1/2025 Demand"
                        maxLength={140}
                     />
                     {errors.title && (
                        <p className="text-sm text-red-500">{errors.title.message}</p>
                     )}
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="status">
                        Status <span className="text-red-500">*</span>
                     </Label>
                     <Select
                        value={watch('status')}
                        onValueChange={(value) => setValue('status', value as DemandStatus, { shouldValidate: true })}
                     >
                        <SelectTrigger id="status">
                           <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="planning">Planejamento</SelectItem>
                           <SelectItem value="in_progress">Em andamento</SelectItem>
                           <SelectItem value="completed">Concluído</SelectItem>
                        </SelectContent>
                     </Select>
                     {errors.status && (
                        <p className="text-sm text-red-500">{errors.status.message}</p>
                     )}
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="description">
                     Descrição <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                     id="description"
                     {...register('description', { required: 'Descrição é obrigatória' })}
                     placeholder="Descrição detalhada da demanda"
                     rows={3}
                  />
                  {errors.description && (
                     <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="startDate">
                        Data de Início <span className="text-red-500">*</span>
                     </Label>
                     <Input
                        id="startDate"
                        type="date"
                        {...register('startDate', { required: 'Data de início é obrigatória' })}
                     />
                     {errors.startDate && (
                        <p className="text-sm text-red-500">{errors.startDate.message}</p>
                     )}
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="endDate">
                        Data de Término <span className="text-red-500">*</span>
                     </Label>
                     <Input
                        id="endDate"
                        type="date"
                        {...register('endDate', {
                           required: 'Data de término é obrigatória',
                           validate: (value) => {
                              const startDate = watch('startDate')
                              if (startDate && value < startDate) {
                                 return 'Data de término deve ser maior ou igual à data de início'
                              }
                              return true
                           },
                        })}
                     />
                     {errors.endDate && (
                        <p className="text-sm text-red-500">{errors.endDate.message}</p>
                     )}
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <Label>
                        Itens <span className="text-red-500">*</span>
                     </Label>
                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ description: '', plannedTotalTons: '' })}
                     >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Item
                     </Button>
                  </div>

                  {fields.map((field, index) => (
                     <div key={field.id} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                           <Input
                              placeholder="Descrição do item"
                              {...register(`items.${index}.description`, {
                                 required: 'Descrição do item é obrigatória',
                              })}
                           />
                           {errors.items?.[index]?.description && (
                              <p className="text-sm text-red-500">
                                 {errors.items[index]?.description?.message}
                              </p>
                           )}
                        </div>
                        <div className="w-32 space-y-2">
                           <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Toneladas"
                              {...register(`items.${index}.plannedTotalTons`, {
                                 required: 'Quantidade é obrigatória',
                                 min: { value: 0, message: 'Deve ser maior ou igual a 0' },
                              })}
                           />
                           {errors.items?.[index]?.plannedTotalTons && (
                              <p className="text-sm text-red-500">
                                 {errors.items[index]?.plannedTotalTons?.message}
                              </p>
                           )}
                        </div>
                        {fields.length > 1 && (
                           <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="mt-0"
                           >
                              <Trash2 className="h-4 w-4 text-red-500" />
                           </Button>
                        )}
                     </div>
                  ))}
                  {errors.items && (errors.items as any).root && (
                     <p className="text-sm text-red-500">{(errors.items as any).root.message}</p>
                  )}
               </div>

               {createDemandMutation.isError && (
                  <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                     <p className="text-sm text-red-600 dark:text-red-400">
                        {createDemandMutation.error instanceof Error
                           ? createDemandMutation.error.message
                           : 'Erro ao criar demanda. Tente novamente.'}
                     </p>
                  </div>
               )}
               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => {
                        onOpenChange(false)
                        reset()
                        createDemandMutation.reset()
                     }}
                  >
                     Cancelar
                  </Button>
                  <Button
                     type="submit"
                     disabled={createDemandMutation.isPending}
                  >
                     {createDemandMutation.isPending ? 'Criando...' : 'Criar Demanda'}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   )
}

export default CreateDemandDialog


