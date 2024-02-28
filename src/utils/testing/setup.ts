import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Options } from '@testing-library/user-event/dist/types/options';

const setup = (ui: ReactElement, options?: Options) => ({
  user: userEvent.setup(options),
  ...render(ui)
});

export default setup;
