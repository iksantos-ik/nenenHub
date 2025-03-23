/*
  Warnings:

  - You are about to alter the column `capacidade` on the `Sala` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sala" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "ativa" BOOLEAN NOT NULL,
    "reservada" BOOLEAN
);
INSERT INTO "new_Sala" ("ativa", "capacidade", "id", "nome") SELECT "ativa", "capacidade", "id", "nome" FROM "Sala";
DROP TABLE "Sala";
ALTER TABLE "new_Sala" RENAME TO "Sala";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
