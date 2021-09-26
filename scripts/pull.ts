import axios from 'axios';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const timestamp = new Date();
const storePath = join(
  __dirname,
  `../stats/${timestamp.getFullYear()}${timestamp
    .getMonth()
    .toString()
    .padStart(2, '0')}${timestamp.getDate()}`
);

if (!existsSync(storePath)) {
  mkdirSync(storePath);
}

const apis = [
  '/account/bank',
  '/account/inventory',
  '/account/materials',
  '/account/wallet',
  '/commerce/delivery',
  '/commerce/listings',
];
const args = process.argv.slice(2);
const request = axios.create({
  baseURL: 'https://api.guildwars2.com/v2',
  headers: { Authorization: `Bearer ${args[0]}` },
});

Promise.all(
  apis.map((api) => {
    return request
      .get(api)
      .then((res) => {
        const splitted = api.split('/');
        writeFile(
          join(storePath, `${splitted[splitted.length - 1]}.json`),
          JSON.stringify(res.data)
        );
      })
      .catch(console.log);
  })
);
