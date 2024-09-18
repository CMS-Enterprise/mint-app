import React from 'react';
import { render, screen } from '@testing-library/react';

import TabPanel from './TabPanel';

describe('The TabPanel component', () => {
  it('renders without errors', () => {
    render(
      <TabPanel id="test" tabName="Tab 1">
        Hello
      </TabPanel>
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
