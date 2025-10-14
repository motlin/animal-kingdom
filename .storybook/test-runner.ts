import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    if (storyContext.parameters?.snapshot === false) {
      return;
    }

    await page.waitForLoadState('domcontentloaded');

    const image = await page.screenshot();
    expect(image).toMatchSnapshot(`${context.id}.png`);
  },
};

export default config;
