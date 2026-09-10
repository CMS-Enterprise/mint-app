import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import ContractAssistanceSection from '.';

describe('ContractAssistanceSection', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: <ContractAssistanceSection />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
