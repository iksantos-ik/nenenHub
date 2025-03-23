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
    "aprovado" BOOLEAN NOT NULL DEFAULT false,
    "reprovado" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Reserva_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reserva" ("aprovado", "dataHoraFim", "dataHoraInicio", "id", "salaId", "titulo", "usuario") SELECT "aprovado", "dataHoraFim", "dataHoraInicio", "id", "salaId", "titulo", "usuario" FROM "Reserva";
DROP TABLE "Reserva";
ALTER TABLE "new_Reserva" RENAME TO "Reserva";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
