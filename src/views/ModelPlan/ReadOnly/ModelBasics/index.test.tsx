import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import i18next from 'i18next';

import { modelBasicsMocks as mocks, modelID } from 'data/mock/readonly';
import { ModelCategory } from 'types/graphql-global-types';

import ReadOnlyModelBasics from './index';

describe('Read Only Model Plan Summary -- Model Basics', () => {
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
      expect(
        screen.getByTestId('read-only-model-plan--model-basics')
      ).toBeInTheDocument();
      expect(screen.getByText('Second Name')).toBeInTheDocument();
      expect(
        screen.getByText(
          i18next.t<string>(
            `basics:modelCategory.options.${ModelCategory.PRIMARY_CARE_TRANSFORMATION}`
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
      expect(
        screen.getByTestId('read-only-model-plan--model-basics')
      ).toBeInTheDocument();
      expect(screen.getByTestId('other-entry')).toHaveTextContent(
        'The Center for Awesomeness'
      );
      expect(screen.getByText('Second Name')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
