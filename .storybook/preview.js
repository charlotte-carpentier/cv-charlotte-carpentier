/** @type { import('@storybook/html').Preview } */

import '../public/css/output.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;