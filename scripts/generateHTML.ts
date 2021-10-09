import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { compileFile } from 'pug';

const template = compileFile(join(__dirname, './template/index.pug'));

const visit = (path: string, prefix: string = '') => {
  readdir(path, { withFileTypes: true })
    .then((items) => {
      return items.map((item) => {
        if (item.isDirectory()) {
          visit(join(path, item.name), prefix + `/${item.name}`);
        }
        return { name: item.name, path: prefix + '/' + item.name };
      });
    })
    .then((links) =>
      writeFile(join(path, 'index.html'), template({ links, title: path }))
    );
};

visit(join(__dirname, '../stats'), '/gw2stats');

export default visit;
