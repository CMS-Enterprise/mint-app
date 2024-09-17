import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import { helpSolutions } from '../../solutionsMap';

import About from '.';

describe('Operational Solutions About Components', () => {
  it.each(helpSolutions)(
    `matches the snapshot`,
    async solutionAboutComponent => {
      const { asFragment } = render(
        <MemoryRouter
          initialEntries={[
            `/help-and-knowledge/operational-solutions?solution=${solutionAboutComponent.route}&section=about`
          ]}
        >
          <Route path="/help-and-knowledge/operational-solutions">
            <About solution={solutionAboutComponent} />
          </Route>
        </MemoryRouter>
      );
      expect(asFragment()).toMatchSnapshot(solutionAboutComponent.name);
    }
  );
});
