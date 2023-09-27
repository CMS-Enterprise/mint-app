import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { shallow } from 'enzyme';

import Footer from './index';

describe('The Footer component', () => {
  it('renders without crashing', () => {
    shallow(
      <MemoryRouter initialEntries={['/report-a-problem']}>
        <Route path="/report-a-problem">
          <Footer />
        </Route>
      </MemoryRouter>
    );
  });
});
