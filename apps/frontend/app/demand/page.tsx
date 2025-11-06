'use client'

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
   Card,
   CardContent,
} from "@/components/ui/card"
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
import { ChevronLeft, ChevronRight, Eye, Plus } from "lucide-react"
import { useDemands, type DemandStatus } from "../hooks/useDemands"
import CreateDemandDialog from "./components/CreateDemandDialog"
import EditDemandDialog from "./components/EditDemandDialog"

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

export default function DemandPage() {
   const [currentPage, setCurrentPage] = useState(1)
   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
   const [editedDemandId, setEditedDemandId] = useState<string | null>(null)
   const { data, isLoading, error } = useDemands(currentPage, PAGE_SIZE)

   const handleEditClick = (demandId: string) => {
      setEditedDemandId(demandId)
   }

   const handleCloseEditDialog = () => {
      setEditedDemandId(null)
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
                           <TableRow
                              key={demand.id}
                              className={newLocal}
                           >
                              <TableCell className="px-6 py-4">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-primary hover:bg-primary/10 transition-colors duration-200"
                                    aria-label={`Visualizar demanda ${demand.title}`}
                                    onClick={() => handleEditClick(demand.id)}
                                 >
                                    <Eye className="h-4 w-4" />
                                 </Button>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-base text-table-text">
                                 {demand.title}
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
                                 {numberFormatter.format(demand.items.reduce((acc, item) => acc + (item.producedTotalTons ?? 0), 0))}
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

            <CreateDemandDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onCreated={() => setCurrentPage(1)} />

            <EditDemandDialog demandId={editedDemandId} onClose={handleCloseEditDialog} />
         </div>
      </section>
   )
}

