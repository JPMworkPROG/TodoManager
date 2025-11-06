import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function DemandPageSkeleton() {
  return (
    <section className="pb-12 pt-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
        <div>
          <Skeleton className="h-8 w-80" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
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
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow
                    key={`skeleton-row-${index}`}
                    className="bg-(--color-table-row-bg) hover:bg-table-row-hover transition-colors duration-200"
                  >
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-8 w-8 rounded" />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-5 w-8" />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-5 w-20 ml-auto" />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-5 w-20 ml-auto" />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-6 w-28 ml-auto rounded-md" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <Skeleton className="h-5 w-64" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-9 rounded" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
