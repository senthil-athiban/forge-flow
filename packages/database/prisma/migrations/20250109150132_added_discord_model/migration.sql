-- CreateTable
CREATE TABLE "Discord" (
    "id" TEXT NOT NULL,
    "guildName" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "botToken" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordChannel" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscordChannel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Discord_guildId_key" ON "Discord"("guildId");

-- CreateIndex
CREATE INDEX "Discord_guildId_idx" ON "Discord"("guildId");

-- CreateIndex
CREATE INDEX "DiscordChannel_channelId_idx" ON "DiscordChannel"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordChannel_discordId_channelId_key" ON "DiscordChannel"("discordId", "channelId");

-- AddForeignKey
ALTER TABLE "Discord" ADD CONSTRAINT "Discord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordChannel" ADD CONSTRAINT "DiscordChannel_discordId_fkey" FOREIGN KEY ("discordId") REFERENCES "Discord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
