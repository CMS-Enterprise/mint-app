import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { ModelCategory } from 'gql/gen/graphql';
import i18next from 'i18next';
import Sinon from 'sinon';

import { modelBasicsMocks as mocks, modelID } from 'data/mock/readonly';

import ReadOnlyModelBasics from './index';

describe('Read Only Model Plan Summary -- Model Basics', () => {
  // Stubing Math.random that occurs in Truss Tooltip component for deterministic output
  Sinon.stub(Math, 'random').returns(0.5);

  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/model-basics">
            <ReadOnlyModelBasics modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('43532323')).toBeInTheDocument();
      expect(
        screen.getByText(
          i18next.t<string>(
            `basics:modelCategory.options.${ModelCategory.STATE_BASED}`
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          i18next.t<string>(
            `basics:modelCategory.options.${ModelCategory.ACCOUNTABLE_CARE}`
          )
        )
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/model-basics">
            <ReadOnlyModelBasics modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('43532323')).toBeInTheDocument();
      expect(
        screen.getByText(
          i18next.t<string>(
            `basics:modelCategory.options.${ModelCategory.STATE_BASED}`
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          i18next.t<string>(
            `basics:modelCategory.options.${ModelCategory.ACCOUNTABLE_CARE}`
          )
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
