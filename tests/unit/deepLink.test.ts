import { describe, expect, test } from 'vitest';
import { internalPath, pathFromPagesRedirect, restorePagesRedirect } from '@/deepLink';

describe('internalPath', () => {
  test.each(['/', '/port', '/realized?each=month'])('accepts the in-app path %s', (path) => {
    expect(internalPath(path)).toBe(path);
  });

  test.each([undefined, '', 'port', '//evil.example', '/\\evil.example', 'https://evil.example', 'javascript:alert(1)', '/\t/evil.example', ['/port']])(
    'rejects %j',
    (value) => {
      expect(internalPath(value)).toBeNull();
    },
  );
});

describe('pathFromPagesRedirect', () => {
  test('reads the path that 404.html put into ?p=', () => {
    expect(pathFromPagesRedirect('?p=%2Frealized%3Feach%3Dmonth')).toBe('/realized?each=month');
  });

  test.each(['', '?q=1', '?p=%2F%2Fevil.example', '?p=https%3A%2F%2Fevil.example'])('ignores %j', (search) => {
    expect(pathFromPagesRedirect(search)).toBeNull();
  });
});

describe('restorePagesRedirect', () => {
  test('puts the original URL back under the base path before the router starts', () => {
    window.history.replaceState(null, '', '/ShuumulatorWeb/?p=%2Frealized%3Feach%3Dmonth');
    restorePagesRedirect(window.location, window.history, '/ShuumulatorWeb/');
    expect(window.location.pathname + window.location.search).toBe('/ShuumulatorWeb/realized?each=month');
  });

  test('leaves the URL alone without a valid ?p=', () => {
    window.history.replaceState(null, '', '/ShuumulatorWeb/?p=%2F%2Fevil.example');
    restorePagesRedirect(window.location, window.history, '/ShuumulatorWeb/');
    expect(window.location.pathname + window.location.search).toBe('/ShuumulatorWeb/?p=%2F%2Fevil.example');
  });
});
