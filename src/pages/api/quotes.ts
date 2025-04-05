import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const { search } = req.query;

  const url = `https://api.hgbrasil.com/finance/stock_price?key=${apiKey}${
    search ? `&symbol=${search}` : ""
  }`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Erro ao buscar cotações." });
  }
}
