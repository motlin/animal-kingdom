import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {expect, test} from 'vite-plus/test';

const read = (path: string): Buffer => readFileSync(join(process.cwd(), path));
const page = new DOMParser().parseFromString(read('index.html').toString('utf8'), 'text/html');

const ORIGIN = 'https://animal-kingdom.motlin.com';
const TITLE = 'Animal Kingdom: a hot-seat animal battle';
const DESCRIPTION =
	'A turn-based battle for 2 to 6 players on one screen. Each player picks an animal with a unique ability, then attacks, heals, shields and howls until one animal is left standing.';
const IMAGE_ALT =
	'The Animal Kingdom logo beside the game setup screen, with a Coyote and a Tiger picked for two players';

// Crawlers for link previews read the HTML as served and run no script, so the tags have to be in the page's own head.
test("the page's head carries the tags link previews read", () => {
	const tags = [...page.head.querySelectorAll('meta[name], meta[property]')]
		.map((meta) => [meta.getAttribute('name') ?? meta.getAttribute('property'), meta.getAttribute('content')])
		.filter(([key]) => key !== 'viewport');
	expect(tags).toStrictEqual([
		['description', DESCRIPTION],
		['og:type', 'website'],
		['og:site_name', 'Animal Kingdom'],
		['og:title', TITLE],
		['og:description', DESCRIPTION],
		['og:url', `${ORIGIN}/`],
		['og:image', `${ORIGIN}/og.png`],
		['og:image:width', '1200'],
		['og:image:height', '630'],
		['og:image:alt', IMAGE_ALT],
		['twitter:card', 'summary_large_image'],
		['twitter:title', TITLE],
		['twitter:description', DESCRIPTION],
		['twitter:image', `${ORIGIN}/og.png`],
	]);
});

test('the preview image is a 1200 by 630 PNG', () => {
	const png = read('public/og.png');
	expect({
		signature: png.subarray(0, 8).toString('hex'),
		width: png.readUInt32BE(16),
		height: png.readUInt32BE(20),
	}).toStrictEqual({
		signature: '89504e470d0a1a0a',
		width: 1200,
		height: 630,
	});
});
