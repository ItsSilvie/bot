import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import * as https from 'https';
import { API_BASE } from './utils/constants';

export interface FeaturedSet {
  image: string;
  name: string;
  sets: {
    name: string;
    prefix: string;
    release_date: string;
    [key: string]: any;
  }[];
  uuid: string;
}

const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const featuredSetsPath = './src/api-data/featured-sets.json';
const logoPath = '../img.silvie.org/docs/cdn/collection-tracker/logo';

export const downloadFeaturedSetLogos = async (): Promise<FeaturedSet[]> => {
  const featuredSets = await fetch(`${API_BASE}/featured-sets`, { agent: httpsAgent })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Unable to fetch featured sets (${response.status})`);
      }

      return response.json() as Promise<FeaturedSet[]>;
    });

  fs.mkdirSync(path.resolve(logoPath), { recursive: true });
  fs.writeFileSync(featuredSetsPath, JSON.stringify(featuredSets), 'utf8');

  for (const featuredSet of featuredSets) {
    const filename = path.basename(featuredSet.image);
    if (!filename || filename === '.') {
      console.warn(`Skipping featured set with invalid image path: ${featuredSet.image}`);
      continue;
    }

    const response = await fetch(`${API_BASE}/featured-sets/images/${encodeURIComponent(filename)}`, {
      agent: httpsAgent,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Unable to fetch featured set logo ${filename} (${response.status})`);
    }

    const buffer = await response.buffer();
    fs.writeFileSync(path.resolve(logoPath, filename), buffer);
    console.log(`Downloaded featured set logo ${filename}`);
  }

  return featuredSets;
};
