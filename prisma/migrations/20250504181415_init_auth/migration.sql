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
    "id_country" INTEGER,
    "id_club" INTEGER,
    "id_grade" INTEGER,
    "firstname" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birthday" VARCHAR(10),
    "sex" CHAR(1),
    "weight" DOUBLE PRECISION,

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
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

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
ALTER TABLE "match" ADD CONSTRAINT "match_id_tournoi_fkey" FOREIGN KEY ("id_tournoi") REFERENCES "tournoi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_id_poule_fkey" FOREIGN KEY ("id_poule") REFERENCES "poule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_id_competiteur1_fkey" FOREIGN KEY ("id_competiteur1") REFERENCES "competiteur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_id_competiteur2_fkey" FOREIGN KEY ("id_competiteur2") REFERENCES "competiteur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
