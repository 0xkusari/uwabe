import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  const { address } = req.query;

  const response = await fetch(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`
  );
  const data = await response.json();
  res.status(200).json(data);
}
