import axios from 'axios';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';
// import generateHTML from './generateHTML';
// import publish from './publish';

const timestamp = new Date();
const storePath = join(
  __dirname,
  `../stats/${timestamp.getFullYear()}/${
    timestamp.getMonth() + 1
  }/${timestamp.getDate()}`
);

if (!existsSync(storePath)) {
  mkdirSync(storePath, { recursive: true });
}

const apis = [
  '/account/bank',
  '/account/inventory',
  '/account/materials',
  '/account/wallet',
  '/commerce/delivery',
  // '/commerce/listings',
];
const args = process.argv.slice(2);
const request = axios.create({
  baseURL: 'https://api.guildwars2.com/v2',
  headers: { Authorization: `Bearer ${args[0]}` },
});

apis.forEach((api) => {
  const splitted = api.split('/');
  const path = join(storePath, `./${splitted.slice(0, -1).join('/')}`);

  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
});

Promise.all(
  apis.map((api) => {
    return request
      .get(api)
      .then((res) => {
        const splitted = api.split('/');

        writeFile(
          join(
            storePath,
            `./${splitted.slice(0, -1).join('/')}`,
            `/${splitted[splitted.length - 1]}.json`
          ),
          JSON.stringify(res.data)
        );
      })
      .catch(console.log);
  })
);
// .then(() => generateHTML(join(__dirname, '../stats'), '/gw2stats'));
// .then(() => publish());
