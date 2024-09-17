import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';

import HelpBox from '.';

export default {
  title: 'Operational Need Help Box',
  component: HelpBox,
  decorators: [
    Story => (
      <MemoryRouter
        initialEntries={[
          '/models/602287ff-d9d5-4203-86eb-e168fbd47242/collaboration-area/task-list/it-solutions'
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions">
          <Story />
        </Route>
      </MemoryRouter>
    )
  ]
} as Meta<typeof HelpBox>;

export const Default = () => <HelpBox />;
