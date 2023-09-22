import React from 'react';
import { useTranslation } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import NavigationBar, { navLinks } from './index';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: String) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    };
  }
}));

vi.mock('launchdarkly-react-client-sdk', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useFlags: () => {
    return {
      systemProfile: true,
      help: true
    };
  }
}));

describe('The NavigationBar component', () => {
  it('renders without errors', async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <NavigationBar
          mobile
          toggle={() => !null}
          signout={() => null}
          userName="A11Y"
        />
      </MemoryRouter>
    );

    expect(getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('displays every navigation element', async () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/system/making-a-request']}>
        <NavigationBar
          mobile
          toggle={() => !null}
          signout={() => null}
          userName="A11Y"
        />
      </MemoryRouter>
    );

    const { t } = useTranslation();

    navLinks().forEach(route => {
      const linkTitle = t(`header:${route.label}`);
      expect(getByText(linkTitle)).toBeInTheDocument();
    });
  });
});
