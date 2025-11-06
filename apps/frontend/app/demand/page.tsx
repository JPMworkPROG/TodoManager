'use client'

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
   Card,
   CardContent,
} from "@/components/ui/card"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, PenSquare, Plus, Trash2, Edit2 } from "lucide-react"
import { useDemands, useCreateDemand, useDemand, useUpdateDemand, type DemandStatus, type CreateDemandPayload, type UpdateDemandPayload } from "../hooks/useDemands"

const statusStyles: Record<DemandStatus, string> = {
   planning: "bg-[#F6CED8] text-black border-[#8C3F57] dark:bg-[#F6CED8] dark:text-black dark:border-[#8C3F57]",
   in_progress: "bg-[#CAE1F7] text-black border-[#0D4B80] dark:bg-[#CAE1F7] dark:text-black dark:border-[#0D4B80]",
   completed: "bg-[#CFEBC7] text-black border-[#1D5A2B] dark:bg-[#CFEBC7] dark:text-black dark:border-[#1D5A2B]",
}

const statusLabels: Record<DemandStatus, string> = {
   planning: "Planejamento",
   in_progress: "Em andamento",
   completed: "Concluído",
}

const numberFormatter = new Intl.NumberFormat("pt-BR")

const PAGE_SIZE = 20

type DemandFormData = {
   title: string
   description: string
   status: DemandStatus
   startDate: string
   endDate: string
   items: Array<{ description: string; plannedTotalTons: string }>
}

type UpdateDemandFormData = {
   title: string
   description: string
   status: DemandStatus
   endDate: string
}

export default function DemandPage() {
   const [currentPage, setCurrentPage] = useState(1)
   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
   const [editedDemandId, setEditedDemandId] = useState<string | null>(null)
   const [isEditMode, setIsEditMode] = useState(false)
   const { data, isLoading, error } = useDemands(currentPage, PAGE_SIZE)
   const createDemandMutation = useCreateDemand()
   const { data: editedDemand, isLoading: isLoadingDemand } = useDemand(editedDemandId)
   const updateDemandMutation = useUpdateDemand()

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

   const {
      register: registerUpdate,
      handleSubmit: handleSubmitUpdate,
      watch: watchUpdate,
      reset: resetUpdate,
      setValue: setValueUpdate,
      formState: { errors: errorsUpdate },
   } = useForm<UpdateDemandFormData>({
      defaultValues: {
         title: '',
         description: '',
         status: 'planning' as DemandStatus,
         endDate: '',
      },
   })

   useEffect(() => {
      if (editedDemand && !isEditMode) {
         resetUpdate({
            title: editedDemand.title,
            description: editedDemand.description,
            status: editedDemand.status,
            endDate: editedDemand.endDate,
         })
      }
   }, [editedDemand, isEditMode, resetUpdate])

   const onSubmit = async (data: DemandFormData) => {
      if (data.items.length === 0) {
         return
      }

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

      if (payload.items.length === 0) {
         return
      }

      createDemandMutation.mutate(payload, {
         onSuccess: () => {
            setIsCreateDialogOpen(false)
            reset()
            setCurrentPage(1)
         },
      })
   }

   const onSubmitUpdate = async (data: UpdateDemandFormData) => {
      if (!editedDemandId) return

      const payload: UpdateDemandPayload = {
         title: data.title,
         description: data.description,
         status: data.status,
         endDate: data.endDate,
      }

      updateDemandMutation.mutate(
         { demandId: editedDemandId, payload },
         {
            onSuccess: () => {
               setIsEditMode(false)
               setEditedDemandId(null)
            },
         }
      )
   }

   const handleEditClick = (demandId: string) => {
      setEditedDemandId(demandId)
      setIsEditMode(false)
   }

   const handleCloseEditDialog = () => {
      setEditedDemandId(null)
      setIsEditMode(false)
      resetUpdate()
      updateDemandMutation.reset()
   }

   const demandsData = data?.data || []
   const paginationMeta = data?.meta || {
      page: 1,
      pageSize: PAGE_SIZE,
      totalItems: 0,
      totalPages: 0,
   }

   const handlePreviousPage = () => {
      if (currentPage > 1) {
         setCurrentPage(prev => prev - 1)
         window.scrollTo({ top: 0, behavior: 'smooth' })
      }
   }

   const handleNextPage = () => {
      if (paginationMeta && currentPage < paginationMeta.totalPages) {
         setCurrentPage(prev => prev + 1)
         window.scrollTo({ top: 0, behavior: 'smooth' })
      }
   }

   if (isLoading) {
      return (
         <section className="pb-12 pt-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
               <div className="text-center py-12">
                  <p className="text-foreground">Carregando demandas...</p>
               </div>
            </div>
         </section>
      )
   }

   if (error) {
      return (
         <section className="pb-12 pt-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
               <div className="text-center py-12">
                  <p className="text-red-500">Erro ao carregar demandas: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
               </div>
            </div>
         </section>
      )
   }

   const newLocal = "bg-(--color-table-row-bg) hover:bg-table-row-hover transition-colors duration-200"
   return (
      <section className="pb-12 pt-10">
         <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
            <div>
               <h1 className="text-2xl font-semibold uppercase tracking-wide text-foreground">
                  Demandas de Produção de Latinhas
               </h1>
            </div>

            <div className="flex items-center justify-between">
               <Button
                  type="button"
                  size="default"
                  className="h-10 px-5 text-xs font-semibold uppercase tracking-[0.3em]"
                  onClick={() => setIsCreateDialogOpen(true)}
               >
                  <Plus className="h-4 w-4" />
                  Adicionar
               </Button>
               <div className="h-px flex-1 translate-y-[13px] bg-transparent" />
            </div>

            <Card className="overflow-hidden border-0 shadow-md ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300">
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-table-header-bg dark:bg-table-header-bg uppercase tracking-wide text-table-header-text transition-colors duration-300">
                        <TableRow className="hover:bg-table-header-bg">
                           <TableHead className="w-24 px-6 py-3 text-xs font-semibold text-table-header-text">
                              Editar
                           </TableHead>
                           <TableHead className="px-6 py-3 text-xs font-semibold text-table-header-text">
                              Período
                           </TableHead>
                           <TableHead className="w-24 px-6 py-3 text-xs font-semibold text-table-header-text">
                              SKUs
                           </TableHead>
                           <TableHead className="w-40 px-6 py-3 text-right text-xs font-semibold text-table-header-text whitespace-nowrap">
                              Total Plan (tons)
                           </TableHead>
                           <TableHead className="w-44 px-6 py-3 text-right text-xs font-semibold text-table-header-text whitespace-nowrap">
                              Total Prod. (tons)
                           </TableHead>
                           <TableHead className="w-36 px-6 py-3 text-right text-xs font-semibold text-table-header-text">
                              Status
                           </TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {demandsData.map((demand) => (
                           <TableRow
                              key={demand.id}
                              className={newLocal}
                           >
                              <TableCell className="px-6 py-4">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-primary hover:bg-primary/10 transition-colors duration-200"
                                    aria-label={`Editar demanda ${demand.title}`}
                                    onClick={() => handleEditClick(demand.id)}
                                 >
                                    <PenSquare className="h-4 w-4" />
                                 </Button>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-base text-table-text">
                                 {demand.startDate} - {demand.endDate}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-base font-semibold text-table-text">
                                 {demand.items.length}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-right text-base font-semibold text-table-text">
                                 {numberFormatter.format(demand.items.reduce((acc, item) => acc + item.plannedTotalTons, 0))}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-right text-base font-semibold text-table-text">
                                 {numberFormatter.format(demand.items.reduce((acc, item) => acc + item.producedTotalTons, 0))}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-right">
                                 <Badge
                                    className={`rounded-md px-3 py-1 text-[0.7rem] font-semibold whitespace-nowrap transition-all duration-200 border ${statusStyles[demand.status]}`}
                                 >
                                    {statusLabels[demand.status]}
                                 </Badge>
                              </TableCell>
                           </TableRow>
                        ))}
                        {Array.from({ length: Math.max(0, 5 - demandsData.length) }).map(
                           (_, index) => (
                              <TableRow
                                 key={`placeholder-${index}`}
                                 className="bg-(--color-table-row-bg) hover:bg-table-row-hover transition-colors duration-200"
                              >
                                 <TableCell className="px-6 py-6">&nbsp;</TableCell>
                                 <TableCell className="px-6 py-6" />
                                 <TableCell className="px-6 py-6" />
                                 <TableCell className="px-6 py-6" />
                                 <TableCell className="px-6 py-6" />
                                 <TableCell className="px-6 py-6" />
                              </TableRow>
                           )
                        )}
                     </TableBody>
                  </Table>
               </CardContent>
               <div className="flex items-center justify-between border-t border-border px-6 py-4">
                  <div className="text-sm text-muted-foreground">
                     Mostrando {((currentPage - 1) * PAGE_SIZE) + 1} a {Math.min(currentPage * PAGE_SIZE, paginationMeta.totalItems)} de {numberFormatter.format(paginationMeta.totalItems)} demandas
                  </div>
                  <div className="flex items-center gap-2">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1 || isLoading}
                        className="h-9 px-3"
                     >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Página anterior</span>
                     </Button>
                     <div className="flex items-center gap-1 text-sm text-foreground">
                        <span className="px-3 py-1.5">
                           Página {currentPage} de {paginationMeta.totalPages}
                        </span>
                     </div>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage >= paginationMeta.totalPages || isLoading}
                        className="h-9 px-3"
                     >
                        <span className="sr-only">Próxima página</span>
                        <ChevronRight className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            </Card>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                        {errors.items && errors.items.root && (
                           <p className="text-sm text-red-500">{errors.items.root.message}</p>
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
                              setIsCreateDialogOpen(false)
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

            <Dialog open={!!editedDemandId} onOpenChange={(open) => !open && handleCloseEditDialog()}>
               <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  {isLoadingDemand ? (
                     <div className="py-12 text-center">
                        <p className="text-foreground">Carregando demanda...</p>
                     </div>
                  ) : editedDemand ? (
                     <>
                        <DialogHeader>
                           <DialogTitle>
                              {isEditMode ? 'Editar Demanda' : 'Detalhes da Demanda'}
                           </DialogTitle>
                           <DialogDescription>
                              {isEditMode
                                 ? 'Atualize os dados da demanda. Os itens não podem ser modificados.'
                                 : 'Visualize os detalhes da demanda.'}
                           </DialogDescription>
                        </DialogHeader>

                        {isEditMode ? (
                           <form onSubmit={handleSubmitUpdate(onSubmitUpdate)} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="edit-title">
                                       Título <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                       id="edit-title"
                                       {...registerUpdate('title', { required: 'Título é obrigatório' })}
                                       placeholder="Ex: Q1/2025 Demand"
                                       maxLength={140}
                                    />
                                    {errorsUpdate.title && (
                                       <p className="text-sm text-red-500">{errorsUpdate.title.message}</p>
                                    )}
                                 </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="edit-status">
                                       Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                       value={watchUpdate('status')}
                                       onValueChange={(value) => setValueUpdate('status', value as DemandStatus, { shouldValidate: true })}
                                    >
                                       <SelectTrigger id="edit-status">
                                          <SelectValue placeholder="Selecione o status" />
                                       </SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="planning">Planejamento</SelectItem>
                                          <SelectItem value="in_progress">Em andamento</SelectItem>
                                          <SelectItem value="completed">Concluído</SelectItem>
                                       </SelectContent>
                                    </Select>
                                    {errorsUpdate.status && (
                                       <p className="text-sm text-red-500">{errorsUpdate.status.message}</p>
                                    )}
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="edit-description">
                                    Descrição <span className="text-red-500">*</span>
                                 </Label>
                                 <Textarea
                                    id="edit-description"
                                    {...registerUpdate('description', { required: 'Descrição é obrigatória' })}
                                    placeholder="Descrição detalhada da demanda"
                                    rows={3}
                                 />
                                 {errorsUpdate.description && (
                                    <p className="text-sm text-red-500">{errorsUpdate.description.message}</p>
                                 )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="edit-startDate">
                                       Data de Início
                                    </Label>
                                    <Input
                                       id="edit-startDate"
                                       type="date"
                                       value={editedDemand.startDate}
                                       disabled
                                       className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">Não pode ser alterada</p>
                                 </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="edit-endDate">
                                       Data de Término <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                       id="edit-endDate"
                                       type="date"
                                       {...registerUpdate('endDate', {
                                          required: 'Data de término é obrigatória',
                                          validate: (value) => {
                                             if (value < editedDemand.startDate) {
                                                return 'Data de término deve ser maior ou igual à data de início'
                                             }
                                             return true
                                          },
                                       })}
                                    />
                                    {errorsUpdate.endDate && (
                                       <p className="text-sm text-red-500">{errorsUpdate.endDate.message}</p>
                                    )}
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <Label>Itens (não editáveis)</Label>
                                 <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-4">
                                    {editedDemand.items.map((item) => (
                                       <div key={item.sku} className="flex gap-4 items-center py-2 border-b last:border-0">
                                          <div className="flex-1">
                                             <p className="text-sm font-medium">{item.description}</p>
                                             <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                                          </div>
                                          <div className="text-right">
                                             <p className="text-sm font-semibold">
                                                {numberFormatter.format(item.plannedTotalTons)} ton
                                             </p>
                                             {item.producedTotalTons > 0 && (
                                                <p className="text-xs text-muted-foreground">
                                                   Produzido: {numberFormatter.format(item.producedTotalTons)} ton
                                                </p>
                                             )}
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              {updateDemandMutation.isError && (
                                 <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                       {updateDemandMutation.error instanceof Error
                                          ? updateDemandMutation.error.message
                                          : 'Erro ao atualizar demanda. Tente novamente.'}
                                    </p>
                                 </div>
                              )}
                              <DialogFooter>
                                 <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditMode(false)}
                                 >
                                    Cancelar
                                 </Button>
                                 <Button
                                    type="submit"
                                    disabled={updateDemandMutation.isPending}
                                 >
                                    {updateDemandMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                                 </Button>
                              </DialogFooter>
                           </form>
                        ) : (
                           <div className="space-y-4">
                              <div>
                                 <div className="grid grid-cols-2 gap-4 mb-2">
                                    <div>
                                       <Label>Título</Label>
                                    </div>
                                    <div>
                                       <Label>Status</Label>
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div>
                                       <p className="text-sm font-medium">{editedDemand.title}</p>
                                    </div>
                                    <div>
                                       <Badge
                                          className={`rounded-md px-3 py-1 text-[0.7rem] font-semibold whitespace-nowrap transition-all duration-200 border ${statusStyles[editedDemand.status]}`}
                                       >
                                          {statusLabels[editedDemand.status]}
                                       </Badge>
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <Label>Descrição</Label>
                                 <p className="text-sm whitespace-pre-wrap">{editedDemand.description}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label>Data de Início</Label>
                                    <p className="text-sm font-medium">{editedDemand.startDate}</p>
                                 </div>
                                 <div className="space-y-2">
                                    <Label>Data de Término</Label>
                                    <p className="text-sm font-medium">{editedDemand.endDate}</p>
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <Label>Itens</Label>
                                 <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-4">
                                    {editedDemand.items.map((item) => (
                                       <div key={item.sku} className="flex gap-4 items-center py-2 border-b last:border-0">
                                          <div className="flex-1">
                                             <p className="text-sm font-medium">{item.description}</p>
                                             <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                                          </div>
                                          <div className="text-right">
                                             <p className="text-sm font-semibold">
                                                Planejado: {numberFormatter.format(item.plannedTotalTons)} ton
                                             </p>
                                             {item.producedTotalTons > 0 && (
                                                <p className="text-xs text-muted-foreground">
                                                   Produzido: {numberFormatter.format(item.producedTotalTons)} ton
                                                </p>
                                             )}
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <DialogFooter>
                                 <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseEditDialog}
                                 >
                                    Fechar
                                 </Button>
                                 <Button
                                    type="button"
                                    onClick={() => setIsEditMode(true)}
                                 >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Editar
                                 </Button>
                              </DialogFooter>
                           </div>
                        )}
                     </>
                  ) : null}
               </DialogContent>
            </Dialog>
         </div>
      </section>
   )
}

