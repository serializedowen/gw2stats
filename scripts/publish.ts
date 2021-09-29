import { publish } from 'gh-pages';
import { join } from 'path';

export default () =>
  publish(join(__dirname, '../stats'), () => {
    console.log('finished');
  });
