// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';

type HelloResponse = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HelloResponse>
) {
  res.status(200).json({ name: 'John Doe' });
}
