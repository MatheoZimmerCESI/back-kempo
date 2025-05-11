-- CreateTable
CREATE TABLE "club" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pays" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "alpha3" TEXT,
    "numeric" TEXT,

    CONSTRAINT "pays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorie" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "ageMin" INTEGER,
    "ageMax" INTEGER,
    "poidsMin" DOUBLE PRECISION,
    "poidsMax" DOUBLE PRECISION,
    "sexe" CHAR(30),

    CONSTRAINT "categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournoi" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "date_debut" VARCHAR(10),
    "date_fin" VARCHAR(10),
    "lieu" TEXT,
    "systemeElimination" CHAR(30),
    "id_categorie" INTEGER,
    "id_pays" INTEGER,

    CONSTRAINT "tournoi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poule" (
    "id" SERIAL NOT NULL,
    "ListeCompetiteurs" JSONB NOT NULL,
    "id_tournoi" INTEGER,

    CONSTRAINT "poule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competiteur" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birthday" VARCHAR(10),
    "sex" CHAR(1),
    "weight" DOUBLE PRECISION,
    "id_country" INTEGER,
    "id_club" INTEGER,
    "id_grade" INTEGER,
    "userId" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "competiteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match" (
    "id" SERIAL NOT NULL,
    "id_tournoi" INTEGER NOT NULL,
    "id_poule" INTEGER,
    "id_competiteur1" INTEGER NOT NULL,
    "id_competiteur2" INTEGER NOT NULL,
    "score1" INTEGER NOT NULL DEFAULT 0,
    "score2" INTEGER NOT NULL DEFAULT 0,
    "keikoku_competiteur1" INTEGER NOT NULL DEFAULT 0,
    "keikoku_competiteur2" INTEGER NOT NULL DEFAULT 0,
    "is_finished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "competiteur_email_key" ON "competiteur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "competiteur_userId_key" ON "competiteur"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_userId_key" ON "PasswordReset"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");

-- AddForeignKey
ALTER TABLE "tournoi" ADD CONSTRAINT "tournoi_id_categorie_fkey" FOREIGN KEY ("id_categorie") REFERENCES "categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournoi" ADD CONSTRAINT "tournoi_id_pays_fkey" FOREIGN KEY ("id_pays") REFERENCES "pays"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poule" ADD CONSTRAINT "poule_id_tournoi_fkey" FOREIGN KEY ("id_tournoi") REFERENCES "tournoi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competiteur" ADD CONSTRAINT "competiteur_id_country_fkey" FOREIGN KEY ("id_country") REFERENCES "pays"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competiteur" ADD CONSTRAINT "competiteur_id_club_fkey" FOREIGN KEY ("id_club") REFERENCES "club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competiteur" ADD CONSTRAINT "competiteur_id_grade_fkey" FOREIGN KEY ("id_grade") REFERENCES "grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competiteur" ADD CONSTRAINT "competiteur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_id_tournoi_fkey" FOREIGN KEY ("id_tournoi") REFERENCES "tournoi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_id_poule_fkey" FOREIGN KEY ("id_poule") REFERENCES "poule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_id_competiteur1_fkey" FOREIGN KEY ("id_competiteur1") REFERENCES "competiteur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_id_competiteur2_fkey" FOREIGN KEY ("id_competiteur2") REFERENCES "competiteur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
