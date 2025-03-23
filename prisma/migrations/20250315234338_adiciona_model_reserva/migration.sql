/*
  Warnings:

  - You are about to drop the column `reservada` on the `Sala` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Reserva" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL,
    "salaId" INTEGER NOT NULL,
    "usuario" TEXT NOT NULL,
    CONSTRAINT "Reserva_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sala" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "ativa" BOOLEAN NOT NULL
);
INSERT INTO "new_Sala" ("ativa", "capacidade", "id", "nome") SELECT "ativa", "capacidade", "id", "nome" FROM "Sala";
DROP TABLE "Sala";
ALTER TABLE "new_Sala" RENAME TO "Sala";
CREATE UNIQUE INDEX "Sala_nome_key" ON "Sala"("nome");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
