/*
  Warnings:

  - You are about to drop the column `usuario` on the `Reserva` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reserva" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dataHoraInicio" DATETIME NOT NULL,
    "dataHoraFim" DATETIME NOT NULL,
    "titulo" TEXT NOT NULL,
    "salaId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "horaReserva" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reserva_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reserva" ("dataHoraFim", "dataHoraInicio", "horaReserva", "id", "salaId", "status", "titulo") SELECT "dataHoraFim", "dataHoraInicio", "horaReserva", "id", "salaId", "status", "titulo" FROM "Reserva";
DROP TABLE "Reserva";
ALTER TABLE "new_Reserva" RENAME TO "Reserva";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
