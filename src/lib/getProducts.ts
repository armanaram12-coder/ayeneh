import fs from 'fs';
import path from 'path';

let cachedData: any = null;

export function getProducts() {
  if (cachedData) return cachedData;
  
  const filePath = path.join(process.cwd(), 'src/data/products.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  cachedData = JSON.parse(fileContents);
  return cachedData;
}
