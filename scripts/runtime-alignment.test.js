// Node.js のバージョンがローカル / Docker / CI でそろっているかをチェックします。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const pinned = read('.nvmrc').trim();
const [major, minor, patch] = pinned.split('.').map(Number);

test('.nvmrc pins an exact version', () => {
  assert.match(pinned, /^\d+\.\d+\.\d+$/);
});

test('pinned version is a patched LTS (2026-10 security release or newer)', () => {
  assert.ok(major % 2 === 0, 'LTS lines are even majors');
  assert.ok(major > 24 || (major === 24 && (minor > 22 || (minor === 22 && patch >= 1))), `${pinned} < 24.22.1`);
});

test('package.json engines and volta match .nvmrc', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.volta?.node, pinned);
  assert.equal(pkg.engines?.node, `>=${pinned} <${major + 1}`);
});

test('Dockerfile uses the same Node version', () => {
  assert.match(read('Dockerfile'), new RegExp(`^ARG NODE_VERSION=${pinned.replaceAll('.', '\\.')}$`, 'm'));
});

test('every workflow reads the Node version from .nvmrc', () => {
  const dir = '.github/workflows';
  const files = readdirSync(new URL(`../${dir}`, import.meta.url));
  assert.ok(files.length > 0);
  for (const file of files) {
    const yaml = read(`${dir}/${file}`);
    assert.doesNotMatch(yaml, /node-version:/, `${file} hard-codes node-version`);
    if (yaml.includes('actions/setup-node')) {
      assert.match(yaml, /node-version-file: \.nvmrc/, `${file} must use .nvmrc`);
    }
  }
});

test('the running Node matches .nvmrc', () => {
  assert.equal(process.version, `v${pinned}`);
});
