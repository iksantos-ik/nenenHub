/*
  Warnings:

  - You are about to drop the column `data` on the `Reserva` table. All the data in the column will be lost.
  - Added the required column `dataHoraFim` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataHoraInicio` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Reserva` table without a default value. This is not possible if the table is not empty.

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
    "usuario" TEXT,
    CONSTRAINT "Reserva_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reserva" ("id", "salaId", "usuario") SELECT "id", "salaId", "usuario" FROM "Reserva";
DROP TABLE "Reserva";
ALTER TABLE "new_Reserva" RENAME TO "Reserva";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
