CREATE TABLE "wallets" (
  "id" character varying NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "balance" integer NOT NULL DEFAULT '0',
  "userId" character varying NOT NULL,
  CONSTRAINT "UQ_35472b1fe48b6330cd349709564" UNIQUE ("userId"),
  CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id")
)