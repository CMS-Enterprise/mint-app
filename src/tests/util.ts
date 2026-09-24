import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent, { type Options } from '@testing-library/user-event';

const setup = (ui: ReactElement, options?: Options) => ({
  user: userEvent.setup(options),
  ...render(ui)
});

export default setup;
