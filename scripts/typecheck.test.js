// npm run typecheck がアプリのコードを本当に検査しているかをチェックします。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/** @param {string[]} args */
function vueTsc(...args) {
  const { status, stdout, stderr } = spawnSync(process.execPath, ['node_modules/vue-tsc/bin/vue-tsc.js', ...args], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return { status, output: stdout + stderr };
}

const sourceFiles = (/** @type {string} */ dir) => readdirSync(new URL(`../${dir}`, import.meta.url), { recursive: true, encoding: 'utf8' })
  .filter((file) => /\.(?:ts|vue|js)$/.test(file))
  .map((file) => `${dir}/${file}`);

test('src and tests have no unchecked .js left', () => {
  const js = [...sourceFiles('src'), ...sourceFiles('tests')].filter((file) => file.endsWith('.js'));
  assert.deepEqual(js, ['tests/e2e/pages-server.js']);
});

test('every .ts / .vue / .js under src and tests is in the typecheck program', () => {
  const listed = ['tsconfig.app.json', 'tsconfig.test.json', 'tsconfig.node.json']
    .flatMap((project) => vueTsc('-p', project, '--listFilesOnly').output.split('\n'))
    .map((line) => line.trim().replace(`${ROOT}`, ''));
  const expected = [...sourceFiles('src'), ...sourceFiles('tests'), ...sourceFiles('scripts').filter((f) => f.endsWith('.test.js'))];
  assert.ok(expected.length > 20);
  assert.deepEqual(expected.filter((file) => !listed.includes(file)), []);
});

test('the same settings catch type errors in .ts and .vue', () => {
  const { status, output } = vueTsc('--noEmit', '-p', 'scripts/fixtures/type-error/tsconfig.json');
  assert.notEqual(status, 0);
  assert.match(output, /bad\.ts\(\d+,\d+\): error TS2322/);
  assert.match(output, /BadComponent\.vue\(\d+,\d+\): error TS2345/);
});
