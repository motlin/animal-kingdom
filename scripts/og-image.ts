import {readFile} from 'node:fs/promises';
import {extname, join} from 'node:path';
import {chromium} from 'playwright';

// Renders public/og.png, the 1200x630 image link previews show, from the built setup screen itself: the logo and the
// animal picker, with the toggles, abilities and start controls hidden. Run it with `just og-image` after changing that screen.
const OUT = 'public/og.png';
const ORIGIN = 'http://og.local';
const TYPES: Record<string, string> =
{
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.woff2': 'font/woff2',
};

// Lays the setup screen out side by side to fill the card: the logo on the left, the battle modes and the players'
// animal picks on the right.
const CARD_CSS = `
	html, body { margin: 0; overflow: hidden; }
	.app { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; gap: 40px; padding: 0 40px; margin: 0; max-width: none; box-sizing: border-box; }
	.theme-toggle, .mute-toggle, .animal-abilities-section, .setup-section, .start-game-container { display: none !important; }
	.header { width: 530px; margin: 0; flex: none; transition: none; }
	.header img.logo { width: 100%; max-width: none; display: block; transition: none; }
	.setup-screen { flex: 1; min-width: 0; margin: 0; padding: 0; max-width: none; }
	.setup-screen h2 { font-size: 2.4rem; margin: 0 0 24px; }
	.mode-selection { flex-direction: column; align-items: stretch; margin-bottom: 28px; }
	.mode-selection .button-mode { width: 100%; max-width: none; font-size: 1.3rem; }
	.player-setup { grid-template-columns: 80px 1.3fr 1fr 1fr; }
	.player-setup > *, .player-setup input, .player-setup select { min-width: 0; width: 100%; box-sizing: border-box; }
`;

const browser = await chromium.launch();
try
{
	const page = await browser.newPage(
		{
			viewport:
			{
				width: 1200,
				height: 630,
			},
		},
	);
	// Serves dist/ to the page without starting a server, since the build links its assets from the site root.
	await page.route(`${ORIGIN}/**`, async (route) =>
	{
		const path = new URL(route.request().url()).pathname;
		const file = join('dist', path === '/' ? 'index.html' : path);
		await route.fulfill(
			{
				body: await readFile(file),
				contentType: TYPES[extname(file)] ?? 'application/octet-stream',
			},
		);
	});
	// A new visitor has only the Coyote unlocked; unlock the Tiger too for the second player's pick.
	await page.addInitScript(() =>
	{
		localStorage.setItem('animalKingdomUnlockedAnimals', JSON.stringify(['Coyote', 'Tiger']));
	});
	await page.goto(
		`${ORIGIN}/`,
		{
			waitUntil: 'networkidle',
		},
	);
	await page.locator('.header .logo').waitFor();
	await page.addStyleTag(
		{
			content: CARD_CSS,
		},
	);
	// Pits the default Coyote against a Tiger, so the card shows a matchup.
	await page.locator('.player-setup').nth(1).locator('select').first().selectOption('Tiger');
	await page.evaluate(async () =>
	{
		await Promise.all([...document.images].map(async (image) => image.decode()));
	});
	await page.screenshot(
		{
			path: OUT,
		},
	);
	console.log(`wrote ${OUT}`);
}
finally
{
	await browser.close();
}
