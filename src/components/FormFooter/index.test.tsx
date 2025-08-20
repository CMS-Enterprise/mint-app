import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import i18next from 'i18next';

import SubmittionFooter from './index';

describe('SubmittionFooter', () => {
  it('renders correctly and matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/status',
          element: (
            <SubmittionFooter
              homeArea="Home"
              homeRoute="/home"
              backPage="/back"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/status'
        ]
      }
    );

    const { asFragment, getByText } = render(
      <RouterProvider router={router} />
    );

    // Check if the back button is rendered
    expect(getByText(i18next.t('miscellaneous:back'))).toBeInTheDocument();

    // Check if the next button is rendered
    expect(getByText(i18next.t('miscellaneous:next'))).toBeInTheDocument();

    // Check if the home button is rendered
    expect(getByText('Home')).toBeInTheDocument();

    // Create a snapshot
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not render back button when backPage is not provided', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/status',
          element: <SubmittionFooter homeArea="Home" homeRoute="/home" />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/status'
        ]
      }
    );

    const { queryByText } = render(<RouterProvider router={router} />);

    expect(
      queryByText(i18next.t('miscellaneous:back'))
    ).not.toBeInTheDocument();
  });

  it('does not render next button when nextPage is false', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/status',
          element: (
            <SubmittionFooter
              homeArea="Home"
              homeRoute="/home"
              nextPage={false}
            />
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/status'
        ]
      }
    );

    const { queryByText } = render(<RouterProvider router={router} />);

    expect(
      queryByText(i18next.t('miscellaneous:next'))
    ).not.toBeInTheDocument();
  });
});
