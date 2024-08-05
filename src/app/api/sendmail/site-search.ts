import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { host } = req.headers;

  if (!host) {
    return res.status(400).json({ error: 'Host header is missing' });
  }

  // Extract subdomain
  const subdomain = host.split('.')[0]; // Assumes subdomain.domain.com

  // Construct the URL with the subdomain
  const apiUrl = `https://apps-api.dopweb.com/prod/site-search?siteName=${subdomain}&max-items=3`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
