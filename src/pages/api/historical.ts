import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const historical = await prisma.historical.findMany();
      res.status(200).json(historical);
    } catch (e: any) {
      res.status(500).json('Server error')
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
      res.status(500).json('Server error');
    }
  }
}
