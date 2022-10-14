import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import RelatedArticle from './index';

describe('RelatedArticle', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <RelatedArticle currentArticle="Model Plan Overview" />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not render the current article in related articles', () => {
    const { queryAllByText } = render(
      <MemoryRouter>
        <RelatedArticle currentArticle="Model Plan Overview" />
      </MemoryRouter>
    );

    expect(queryAllByText('Model Plan Overview').length).toBe(0);
  });
});
