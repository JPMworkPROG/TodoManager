'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Eye, Plus } from 'lucide-react'
import {
   useFetchDemands,
   useFetchDemand,
   type DemandStatus,
} from '../hooks/useDemands'
import { BaseDialog } from '@/components/dialog/BaseDialog'
import { CreateDemandContent } from './components/dialog/CreateDemandContent'
import { ViewDemandContent } from './components/dialog/ViewDemandContent'
import { EditDemandContent } from './components/dialog/EditDemandContent'
import { DemandPageSkeleton } from './components/DemandPageSkeleton'
import { DemandDialogSkeleton } from './components/DemandDialogSkeleton'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'
import config from '@/lib/loadEnv'

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

export default function DemandPage() {
   const [currentPage, setCurrentPage] = useState(1)
   const [showCreateDialog, setShowCreateDialog] = useState(false)
   const [selectedDemandId, setSelectedDemandId] = useState<string | null>(null)
   const [editMode, setEditMode] = useState(false)

   const PAGE_SIZE = config.PAGE_SIZE
   const {
      data: demandList,
      isLoading,
      error,
   } = useFetchDemands(currentPage, PAGE_SIZE)
   const { data: selectedDemand, isLoading: loadingDemand } =
      useFetchDemand(selectedDemandId)

   useEffect(() => {
      if (!selectedDemandId) setEditMode(false)
   }, [selectedDemandId])

   const demandsData = demandList?.data || []
   const paginationMeta = demandList?.meta || {
      page: 1,
      pageSize: PAGE_SIZE,
      totalItems: 0,
      totalPages: 0,
   }

   if (isLoading) {
      return <DemandPageSkeleton />
   }

   if (error) {
      return (
         <section className="pb-12 pt-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
               <div className="text-center py-12">
                  <p className="text-red-500">
                     Erro ao carregar demandas:{' '}
                     {error instanceof Error ? error.message : 'Erro desconhecido'}
                  </p>
               </div>
            </div>
         </section>
      )
   }

   return (
      <section className="pb-12 pt-10">
         <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
            <div>
               <h1 className="text-2xl font-semibold uppercase tracking-wide text-foreground">
                  Demandas de Produção de Latinhas
               </h1>
            </div>

            <div className="flex items-center justify-between">
               <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Demanda
               </Button>
               <div className="h-px flex-1 translate-y-[13px] bg-transparent" />
            </div>

            <Card className="overflow-hidden border-0 shadow-md ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300">
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-table-header-bg dark:bg-table-header-bg uppercase tracking-wide text-table-header-text transition-colors duration-300">
                        <TableRow className="hover:bg-table-header-bg">
                           <TableHead className="w-24 px-6 py-3 text-xs font-semibold text-table-header-text">
                              Visualizar
                           </TableHead>
                           <TableHead className="px-6 py-3 text-xs font-semibold text-table-header-text">
                              Título
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
                           <TableRow key={demand.id} className="bg-(--color-table-row-bg) hover:bg-table-row-hover transition-colors duration-200">
                              <TableCell className="px-6 py-4">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedDemandId(demand.id)}
                                 >
                                    <Eye className="h-4 w-4" />
                                 </Button>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-base text-table-text">
                                 <div className="max-w-30 truncate" title={demand.title}>
                                    {demand.title}
                                 </div>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-base text-table-text whitespace-nowrap">
                                 {formatDate(demand.startDate)} -{' '}
                                 {formatDate(demand.endDate)}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-base font-semibold text-table-text">
                                 {demand.items.length}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-right text-base font-semibold text-table-text">
                                 {numberFormatter.format(
                                    demand.items.reduce(
                                       (acc, item) => acc + item.plannedTotalTons,
                                       0,
                                    ),
                                 )}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-right text-base font-semibold text-table-text">
                                 {numberFormatter.format(
                                    demand.items.reduce(
                                       (acc, item) => acc + (item.producedTotalTons ?? 0),
                                       0,
                                    ),
                                 )}
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
                        {Array.from({
                           length: Math.max(0, 5 - demandsData.length),
                        }).map((_, index) => (
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
                              <TableCell className="px-6 py-6" />
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
               <div className="flex items-center justify-between border-t border-border px-6 py-4">
                  <div className="text-sm text-muted-foreground">
                     Mostrando {(currentPage - 1) * PAGE_SIZE + 1} a{' '}
                     {Math.min(currentPage * PAGE_SIZE, paginationMeta.totalItems)} de{' '}
                     {numberFormatter.format(paginationMeta.totalItems)} demandas
                  </div>
                  <div className="flex items-center gap-2">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}
                     >
                        <ChevronLeft className="h-4 w-4" />
                     </Button>
                     <span className="text-sm">
                        Página {currentPage} de {paginationMeta.totalPages}
                     </span>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage >= paginationMeta.totalPages}
                     >
                        <ChevronRight className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            </Card>

            <BaseDialog
               open={showCreateDialog}
               onOpenChange={setShowCreateDialog}
               maxWidth="2xl"
            >
               <CreateDemandContent
                  onClose={() => setShowCreateDialog(false)}
                  onCreated={() => setCurrentPage(1)}
               />
            </BaseDialog>

            <BaseDialog
               open={!!selectedDemandId}
               onOpenChange={(open) => !open && setSelectedDemandId(null)}
               maxWidth="5xl"
            >
               {loadingDemand ? (
                  <DemandDialogSkeleton />
               ) : selectedDemand ? (
                  editMode ? (
                     <EditDemandContent
                        demand={selectedDemand}
                        onCancel={() => setEditMode(false)}
                        onSuccess={() => setEditMode(false)}
                     />
                  ) : (
                     <ViewDemandContent
                        demand={selectedDemand}
                        onClose={() => setSelectedDemandId(null)}
                        onEditMode={() => setEditMode(true)}
                     />
                  )
               ) : (
                  <>
                     <DialogHeader>
                        <DialogTitle>Erro</DialogTitle>
                     </DialogHeader>
                     <div className="py-12 text-center">
                        <p className="text-muted-foreground mb-4">
                           Erro ao carregar demanda.
                        </p>
                        <Button onClick={() => setSelectedDemandId(null)}>
                           Fechar
                        </Button>
                     </div>
                  </>
               )}
            </BaseDialog>
         </div>
      </section>
   )
}
