import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import SuggestedMilestoneBanner from './index';

const suggestedMilestone: {
  __typename: 'MTOCommonMilestone';
  isSuggested: boolean;
  isAdded: boolean;
}[] = [
  {
    __typename: 'MTOCommonMilestone',
    isSuggested: true,
    isAdded: false
  }
];

describe('SuggestedMilestoneBanner component', () => {
  it('renders correctly and has one suggested milestone and matches snapshot', () => {
    const { getByText, asFragment } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
            <SuggestedMilestoneBanner
              suggestedMilestones={[...suggestedMilestone]}
            />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(getByText(/There is 1 suggested milestone/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly and has two suggested milestones and matches snapshot', () => {
    const { getByText, asFragment } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
            <SuggestedMilestoneBanner
              suggestedMilestones={[
                ...suggestedMilestone,
                ...suggestedMilestone
              ]}
            />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(getByText(/There are 2 suggested milestones/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders 1 suggested milestone and does not show isAdded milestones', () => {
    const { getByText, asFragment } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
            <SuggestedMilestoneBanner
              suggestedMilestones={[
                ...suggestedMilestone,
                {
                  __typename: 'MTOCommonMilestone',
                  isSuggested: true,
                  isAdded: true
                }
              ]}
            />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(getByText(/There are 2 suggested milestones/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly and has no suggested milestones and matches snapshot', () => {
    const { getByText, asFragment } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
            <SuggestedMilestoneBanner suggestedMilestones={[]} />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(getByText(/There aren't currently/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
