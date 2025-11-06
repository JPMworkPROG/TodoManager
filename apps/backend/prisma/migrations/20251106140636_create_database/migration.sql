-- CreateTable
CREATE TABLE "Demand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planning',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DemandItem" (
    "sku" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "plannedTotalTons" REAL NOT NULL,
    "producedTotalTons" REAL DEFAULT 0,
    "demandId" TEXT NOT NULL,
    CONSTRAINT "DemandItem_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "Demand" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Demand_status_idx" ON "Demand"("status");

-- CreateIndex
CREATE INDEX "Demand_startDate_idx" ON "Demand"("startDate");

-- CreateIndex
CREATE INDEX "Demand_endDate_idx" ON "Demand"("endDate");

-- CreateIndex
CREATE INDEX "DemandItem_demandId_idx" ON "DemandItem"("demandId");
