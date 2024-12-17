import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { categoryMock, milestoneMock } from 'tests/mock/mto';
import { modelID } from 'tests/mock/readonly';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import EditMilestoneForm from '.';

describe('Custom Catergory form', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/`]}>
        <MessageProvider>
          <VerboseMockedProvider
            mocks={[...milestoneMock, ...categoryMock]}
            addTypename={false}
          >
            <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix?edit-milestone=123">
              <EditMilestoneForm
                closeModal={() => {}}
                setIsDirty={() => {}}
                submitted={{ current: false }}
              />
            </Route>
          </VerboseMockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    // await waitFor(() => {
    //   expect(
    //     screen.getByText(
    //       'Choose a primary category if you are adding a sub-category, or choose "None" if you are adding a primary category.'
    //     )
    //   ).toBeInTheDocument();
    // });

    expect(asFragment()).toMatchSnapshot();
  });
});
