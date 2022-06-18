import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product>
) {
  if (req.method === 'GET') {
    try {
      const historical = await prisma.historical.findMany();
      res.status(200).json(historical);
    } catch (e: any) {
      console.log('🚀 ~ file: product.ts ~ line 15 ~ e', e);
      throw new Error("Can't get products historical");
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, id, description } = req.body;
      const product = await prisma.historical.create({
        data: { name, id, description },
      });
      res.status(200).json(product);
    } catch (e: any) {
      console.log('🚀 ~ file: product.ts ~ line 28 ~ e', e);
      throw new Error("Can't create product historical");
    }
  }
}
