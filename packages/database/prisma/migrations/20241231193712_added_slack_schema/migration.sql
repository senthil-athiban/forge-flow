-- CreateTable
CREATE TABLE "Slack" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "workspaceToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlackChannel" (
    "id" TEXT NOT NULL,
    "slackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlackChannel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Slack_userId_key" ON "Slack"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Slack_workspaceId_key" ON "Slack"("workspaceId");

-- CreateIndex
CREATE INDEX "Slack_workspaceId_idx" ON "Slack"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Slack_userId_workspaceId_key" ON "Slack"("userId", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "SlackChannel_channelId_key" ON "SlackChannel"("channelId");

-- CreateIndex
CREATE INDEX "SlackChannel_channelId_idx" ON "SlackChannel"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "SlackChannel_slackId_channelId_key" ON "SlackChannel"("slackId", "channelId");

-- AddForeignKey
ALTER TABLE "Slack" ADD CONSTRAINT "Slack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlackChannel" ADD CONSTRAINT "SlackChannel_slackId_fkey" FOREIGN KEY ("slackId") REFERENCES "Slack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
