import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

type ApiResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> {
  try {
    // Get the deployment ID from the .next/data folder
    const nextDataPath = path.join(process.cwd(), '.next', 'data');

    if (!fs.existsSync(nextDataPath)) {
      return res.status(500).json({
        success: false,
        error: 'The .next/data folder does not exist. Deployment ID is missing.',
      });
    }

    const directories = fs.readdirSync(nextDataPath);

    if (directories.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'No deployment ID found in the .next/data folder.',
      });
    }

    const deploymentId = directories[0]; // Assumes only one deployment folder exists

    // Construct the URL dynamically
    const url = `https://next-three-jade.vercel.app/_next/data/${deploymentId}/plp.json`;

    // Fetch the data from the URL
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const data = await response.json();

    // Send the data back in the API response
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('Error in cache-warm API:', error.message);

    res.status(500).json({
      success: false,
      error: error.message || 'An unknown error occurred.',
    });
  }
}
