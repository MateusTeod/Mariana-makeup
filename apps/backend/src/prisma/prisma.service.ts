import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// Prisma serializes Decimal values as strings by default. The API contract uses numbers for prices.
const decimalPrototype = Decimal.prototype as unknown as {
  toJSON: () => number;
};

decimalPrototype.toJSON = function (this: Decimal): number {
  return this.toNumber();
};

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
