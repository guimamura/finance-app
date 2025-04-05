import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key not found" });
  }

  try {
    const response = await fetch(
      `https://api.hgbrasil.com/finance?format=json-cors&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch quotes");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao buscar cotações", error);
    res.status(500).json({ error: "Erro ao buscar cotações" });
  }
}
