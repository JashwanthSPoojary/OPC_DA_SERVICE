/*
  Warnings:

  - Changed the type of `quality` on the `OPCLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."OPCLog" DROP COLUMN "quality",
ADD COLUMN     "quality" INTEGER NOT NULL;
