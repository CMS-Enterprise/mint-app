import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import { helpSolutions } from '../../solutionsMap';

import PointsOfContact from '.';

describe('IT Solutions Points of Contact Components', () => {
  it.each(helpSolutions)(`matches the snapshot`, async solutionPoCComponent => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/help-and-knowledge/operational-solutions?solution=${solutionPoCComponent.route}&section=points-of-contact`
        ]}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <PointsOfContact solution={solutionPoCComponent} />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot(solutionPoCComponent.name);
  });
});
