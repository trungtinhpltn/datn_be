-- CreateTable
CREATE TABLE "Shift" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "monday" INTEGER[],
    "tuesday" INTEGER[],
    "wednesday" INTEGER[],
    "thursday" INTEGER[],
    "friday" INTEGER[],
    "saturday" INTEGER[],
    "sunday" INTEGER[],

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryShift" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year" INTEGER NOT NULL,
    "monday" INTEGER[],
    "tuesday" INTEGER[],
    "wednesday" INTEGER[],
    "thursday" INTEGER[],
    "friday" INTEGER[],
    "saturday" INTEGER[],
    "sunday" INTEGER[],

    CONSTRAINT "HistoryShift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shift_employeeId_key" ON "Shift"("employeeId");

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryShift" ADD CONSTRAINT "HistoryShift_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
