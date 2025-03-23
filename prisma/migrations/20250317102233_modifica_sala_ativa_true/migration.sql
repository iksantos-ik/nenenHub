-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sala" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Sala" ("ativa", "capacidade", "id", "nome") SELECT "ativa", "capacidade", "id", "nome" FROM "Sala";
DROP TABLE "Sala";
ALTER TABLE "new_Sala" RENAME TO "Sala";
CREATE UNIQUE INDEX "Sala_nome_key" ON "Sala"("nome");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
