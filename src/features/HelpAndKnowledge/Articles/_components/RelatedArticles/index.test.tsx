import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import { HelpArticle } from '../..';

import RelatedArticle from './index';

describe('RelatedArticle', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <RelatedArticle currentArticle={HelpArticle.MODEL_PLAN_OVERVIEW} />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not render the current article in related articles', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <RelatedArticle currentArticle={HelpArticle.MODEL_PLAN_OVERVIEW} />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { queryAllByText } = render(<RouterProvider router={router} />);

    expect(queryAllByText('Model Plan Overview').length).toBe(0);
  });
});
