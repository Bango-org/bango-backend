-- AlterTable
ALTER TABLE "Outcome" ALTER COLUMN "current_supply" SET DEFAULT 0,
ALTER COLUMN "current_supply" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "total_liquidity" SET DEFAULT 0,
ALTER COLUMN "total_liquidity" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "TokenAllocation" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);
