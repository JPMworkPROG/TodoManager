'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit2, Plus, Save, X, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDemand, useUpdateDemand, useCreateDemandItem, useUpdateDemandItem, type DemandStatus } from "../../hooks/useDemands"
import type { DemandItem } from "../../api/demands"

type UpdateDemandFormData = {
   title: string
   description: string
   status: DemandStatus
   endDate: string
}

type ItemCreateForm = { description: string; plannedTotalTons: string }
type ItemEditForm = { description: string; plannedTotalTons: string; producedTotalTons: string }

type EditDemandDialogProps = {
   demandId: string | null
   onClose: () => void
}

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

export function EditDemandDialog({ demandId, onClose }: EditDemandDialogProps) {
   const [isEditMode, setIsEditMode] = useState(false)
   const [editingItemId, setEditingItemId] = useState<number | null>(null)
   const [isAddingItem, setIsAddingItem] = useState(false)

   const { data: editedDemand, isLoading: isLoadingDemand } = useDemand(demandId)
   const updateDemandMutation = useUpdateDemand()
   const createDemandItemMutation = useCreateDemandItem()
   const updateDemandItemMutation = useUpdateDemandItem()

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
      defaultValues: { description: '', plannedTotalTons: '', producedTotalTons: '' },
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

   const onSubmitUpdate = async (data: UpdateDemandFormData) => {
      if (!demandId) return
      updateDemandMutation.mutate(
         { demandId, payload: { title: data.title, description: data.description, status: data.status, endDate: data.endDate } },
         { onSuccess: () => { setIsEditMode(false) } }
      )
   }

   const handleAddItem = async (data: ItemCreateForm) => {
      if (!demandId) return
      createDemandItemMutation.mutate(
         { demandId, payload: { description: data.description, plannedTotalTons: parseFloat(data.plannedTotalTons) || 0 } },
         { onSuccess: () => { setIsAddingItem(false); resetItem() } }
      )
   }

   const handleEditItem = (item: DemandItem) => {
      setEditingItemId(item.sku)
      setValueEditItem('description', item.description)
      setValueEditItem('plannedTotalTons', item.plannedTotalTons.toString())
      setValueEditItem('producedTotalTons', item.producedTotalTons?.toString() || '')
   }

   const handleSaveItem = async (data: ItemEditForm) => {
      if (!demandId || !editingItemId) return
      updateDemandItemMutation.mutate(
         {
            demandId, itemId: editingItemId, payload: {
               description: data.description,
               plannedTotalTons: parseFloat(data.plannedTotalTons) || undefined,
               producedTotalTons: data.producedTotalTons ? parseFloat(data.producedTotalTons) : undefined,
            }
         },
         { onSuccess: () => { setEditingItemId(null); resetEditItem() } }
      )
   }

   const handleCancelEditItem = () => {
      setEditingItemId(null)
      resetEditItem()
   }

   const handleClose = () => {
      onClose()
      setIsEditMode(false)
      setEditingItemId(null)
      setIsAddingItem(false)
      resetUpdate()
      resetItem()
      resetEditItem()
      updateDemandMutation.reset()
      createDemandItemMutation.reset()
      updateDemandItemMutation.reset()
   }

   return (
      <Dialog open={!!demandId} onOpenChange={(open) => { if (!open) handleClose() }}>
         <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
               {isLoadingDemand ? (
                  <>
                     <DialogTitle>Carregando demanda...</DialogTitle>
                  </>
               ) : editedDemand ? (
                  <>
                     {isEditMode ? (
                        <>
                           <DialogTitle>Editar Demanda</DialogTitle>
                           <DialogDescription>Atualize os dados da demanda. Você pode adicionar e editar itens abaixo.</DialogDescription>
                        </>
                     ) : (
                        <>
                           <DialogTitle>{editedDemand.title}</DialogTitle>
                           {editedDemand.description && (
                              <DialogDescription className="whitespace-pre-wrap">{editedDemand.description}</DialogDescription>
                           )}
                        </>
                     )}
                  </>
               ) : (
                  <>
                     <DialogTitle>Erro ao carregar demanda</DialogTitle>
                  </>
               )}
            </DialogHeader>
            {isLoadingDemand ? (
               <div className="py-12 text-center">
                  <p className="text-foreground">Carregando demanda...</p>
               </div>
            ) : editedDemand ? (
               <>

                  {isEditMode ? (
                     <form onSubmit={handleSubmitUpdate(onSubmitUpdate)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label htmlFor="edit-title">
                                 Título <span className="text-red-500">*</span>
                              </Label>
                              <Input id="edit-title" {...registerUpdate('title', { required: 'Título é obrigatório' })} placeholder="Ex: Q1/2025 Demand" maxLength={140} />
                              {errorsUpdate.title && (<p className="text-sm text-red-500">{errorsUpdate.title.message}</p>)}
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="edit-status">
                                 Status <span className="text-red-500">*</span>
                              </Label>
                              <Select value={watchUpdate('status')} onValueChange={(value) => setValueUpdate('status', value as DemandStatus, { shouldValidate: true })}>
                                 <SelectTrigger id="edit-status">
                                    <SelectValue placeholder="Selecione o status" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="planning">Planejamento</SelectItem>
                                    <SelectItem value="in_progress">Em andamento</SelectItem>
                                    <SelectItem value="completed">Concluído</SelectItem>
                                 </SelectContent>
                              </Select>
                              {errorsUpdate.status && (<p className="text-sm text-red-500">{errorsUpdate.status.message}</p>)}
                           </div>
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="edit-description">
                              Descrição <span className="text-red-500">*</span>
                           </Label>
                           <Textarea id="edit-description" {...registerUpdate('description', { required: 'Descrição é obrigatória' })} placeholder="Descrição detalhada da demanda" rows={3} />
                           {errorsUpdate.description && (<p className="text-sm text-red-500">{errorsUpdate.description.message}</p>)}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label htmlFor="edit-startDate">Data de Início</Label>
                              <Input id="edit-startDate" type="date" value={editedDemand.startDate} disabled className="bg-muted" />
                              <p className="text-xs text-muted-foreground">Não pode ser alterada</p>
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="edit-endDate">Data de Término <span className="text-red-500">*</span></Label>
                              <Input id="edit-endDate" type="date" {...registerUpdate('endDate', { required: 'Data de término é obrigatória', validate: (value) => { if (value < editedDemand.startDate) { return 'Data de término deve ser maior ou igual à data de início' } return true } })} />
                              {errorsUpdate.endDate && (<p className="text-sm text-red-500">{errorsUpdate.endDate.message}</p>)}
                           </div>
                        </div>

                        {updateDemandMutation.isError && (
                           <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                              <p className="text-sm text-red-600 dark:text-red-400">
                                 {updateDemandMutation.error instanceof Error ? updateDemandMutation.error.message : 'Erro ao atualizar demanda. Tente novamente.'}
                              </p>
                           </div>
                        )}
                        <DialogFooter>
                           <Button type="button" variant="outline" onClick={() => setIsEditMode(false)}>Cancelar</Button>
                           <Button type="submit" disabled={updateDemandMutation.isPending}>{updateDemandMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}</Button>
                        </DialogFooter>
                     </form>
                  ) : (
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <Badge className={`rounded-md px-3 py-1 text-[0.7rem] font-semibold whitespace-nowrap transition-all duration-200 border ${statusStyles[editedDemand.status]}`}>{statusLabels[editedDemand.status]}</Badge>
                                 <p className="text-sm text-muted-foreground">{editedDemand.startDate} - {editedDemand.endDate}</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <Label className="text-sm font-semibold tracking-wide">Itens</Label>
                              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingItem(true)}>
                                 <Plus className="h-4 w-4 mr-1" />
                                 Adicionar Item
                              </Button>
                           </div>
                           <div className="max-h-[60vh] overflow-y-auto border rounded-md">
                              {isAddingItem && (
                                 <div className="p-3 border-b bg-muted/50">
                                    <form onSubmit={handleSubmitItem(handleAddItem)} className="flex gap-2 items-start">
                                       <div className="flex-1 space-y-2">
                                          <Input placeholder="Descrição do item" {...registerItem('description', { required: 'Descrição é obrigatória' })} />
                                          {errorsItem.description && (<p className="text-xs text-red-500">{errorsItem.description.message}</p>)}
                                       </div>
                                       <div className="w-28 space-y-2">
                                          <Input type="number" step="0.01" min="0" placeholder="Planejado (ton)" {...registerItem('plannedTotalTons', { required: 'Quantidade planejada é obrigatória', min: { value: 0, message: 'Deve ser maior ou igual a 0' } })} />
                                          {errorsItem.plannedTotalTons && (<p className="text-xs text-red-500">{errorsItem.plannedTotalTons.message}</p>)}
                                       </div>
                                       <div className="flex gap-1">
                                          <Button type="submit" size="icon" variant="ghost" disabled={createDemandItemMutation.isPending} className="h-9 w-9">
                                             <Save className="h-4 w-4 text-green-600" />
                                          </Button>
                                          <Button type="button" size="icon" variant="ghost" onClick={() => { setIsAddingItem(false); resetItem() }} className="h-9 w-9">
                                             <X className="h-4 w-4 text-red-600" />
                                          </Button>
                                       </div>
                                    </form>
                                 </div>
                              )}
                              <Table>
                                 <TableHeader>
                                    <TableRow>
                                       <TableHead className="w-28">SKU</TableHead>
                                       <TableHead>Descrição</TableHead>
                                       <TableHead className="w-40 text-right">Total Plan (tons)</TableHead>
                                       <TableHead className="w-44 text-right">Total Produ (tons)</TableHead>
                                       <TableHead className="w-16 text-center">Editar</TableHead>
                                       <TableHead className="w-16 text-center">Excluir</TableHead>
                                    </TableRow>
                                 </TableHeader>
                                 <TableBody>
                                    {editedDemand.items.map((item) => (
                                       editingItemId === item.sku ? (
                                          <TableRow key={item.sku}>
                                             <TableCell className="align-top">
                                                <span className="text-xs text-muted-foreground">{item.sku}</span>
                                             </TableCell>
                                             <TableCell colSpan={4} className="align-top">
                                                <form onSubmit={handleSubmitEditItem(handleSaveItem)} className="flex gap-2 items-start">
                                                   <div className="flex-1 space-y-2">
                                                      <Input placeholder="Descrição do item" {...registerEditItem('description', { required: 'Descrição é obrigatória' })} />
                                                      {errorsEditItem.description && (<p className="text-xs text-red-500">{errorsEditItem.description.message}</p>)}
                                                   </div>
                                                   <div className="w-28">
                                                      <Input type="number" step="0.01" min="0" placeholder="Planejado (ton)" {...registerEditItem('plannedTotalTons', { required: 'Quantidade planejada é obrigatória', min: { value: 0, message: 'Deve ser maior ou igual a 0' } })} />
                                                   </div>
                                                   <div className="w-28">
                                                      <Input type="number" step="0.01" min="0" placeholder="Produzido (ton)" {...registerEditItem('producedTotalTons')} />
                                                   </div>
                                                   <div className="flex gap-1">
                                                      <Button type="submit" size="icon" variant="ghost" disabled={updateDemandItemMutation.isPending} className="h-9 w-9">
                                                         <Save className="h-4 w-4 text-green-600" />
                                                      </Button>
                                                      <Button type="button" size="icon" variant="ghost" onClick={handleCancelEditItem} className="h-9 w-9">
                                                         <X className="h-4 w-4 text-red-600" />
                                                      </Button>
                                                   </div>
                                                </form>
                                             </TableCell>
                                             <TableCell className="text-center align-top">
                                                <Button type="button" size="icon" variant="ghost" disabled className="h-8 w-8">
                                                   <Trash2 className="h-4 w-4" />
                                                </Button>
                                             </TableCell>
                                          </TableRow>
                                       ) : (
                                          <TableRow key={item.sku}>
                                             <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                                             <TableCell>{item.description}</TableCell>
                                             <TableCell className="text-right font-semibold">{numberFormatter.format(item.plannedTotalTons)}</TableCell>
                                             <TableCell className="text-right font-semibold">{numberFormatter.format(item.producedTotalTons ?? 0)}</TableCell>
                                             <TableCell className="text-center">
                                                <Button type="button" size="icon" variant="ghost" onClick={() => handleEditItem(item)} className="h-8 w-8">
                                                   <Edit2 className="h-4 w-4" />
                                                </Button>
                                             </TableCell>
                                             <TableCell className="text-center">
                                                <Button type="button" size="icon" variant="ghost" disabled className="h-8 w-8" aria-label="Excluir (indisponível)">
                                                   <Trash2 className="h-4 w-4" />
                                                </Button>
                                             </TableCell>
                                          </TableRow>
                                       )
                                    ))}
                                 </TableBody>
                              </Table>
                           </div>
                           {(createDemandItemMutation.isError || updateDemandItemMutation.isError) && (
                              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                                 <p className="text-sm text-red-600 dark:text-red-400">
                                    {createDemandItemMutation.error instanceof Error
                                       ? createDemandItemMutation.error.message
                                       : updateDemandItemMutation.error instanceof Error
                                          ? updateDemandItemMutation.error.message
                                          : 'Erro ao processar item. Tente novamente.'}
                                 </p>
                              </div>
                           )}
                        </div>

                        <DialogFooter>
                           <Button type="button" variant="outline" onClick={handleClose}>Fechar</Button>
                           <Button type="button" onClick={() => setIsEditMode(true)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Editar
                           </Button>
                        </DialogFooter>
                     </div>
                  )}
               </>
            ) : (
               <div className="py-12 text-center">
                  <p className="text-foreground">Erro ao carregar demanda. Tente novamente.</p>
                  <Button type="button" variant="outline" onClick={handleClose} className="mt-4">
                     Fechar
                  </Button>
               </div>
            )}
         </DialogContent>
      </Dialog>
   )
}

export default EditDemandDialog


