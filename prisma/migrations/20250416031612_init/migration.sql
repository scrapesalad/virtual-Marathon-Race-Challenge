-- CreateTable
CREATE TABLE "Cheer" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "audioUrl" TEXT,
    "milestone" DOUBLE PRECISION NOT NULL,
    "userRaceId" TEXT NOT NULL,
    "senderId" TEXT,
    "senderName" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cheer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkpoint" (
    "id" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "distance" DOUBLE PRECISION NOT NULL,
    "coordinates" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Checkpoint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cheer" ADD CONSTRAINT "Cheer_userRaceId_fkey" FOREIGN KEY ("userRaceId") REFERENCES "UserRace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE CASCADE ON UPDATE CASCADE;
