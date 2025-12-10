import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { keyContactsMock } from 'tests/mock/general';

import SmeModal, { KeyContactType } from '.';

const contact: KeyContactType = {
  __typename: 'KeyContact',
  id: '123',
  name: 'Aliza Kim',
  email: 'aliza.kim@cms.hhs.gov',
  mailboxTitle: '',
  mailboxAddress: '',
  subjectArea: 'Healthcare',
  subjectCategoryID: '',
  userAccount: {
    __typename: 'UserAccount',
    id: '123',
    commonName: 'Aliza Kim',
    email: 'aliza.kim@cms.hhs.gov',
    username: 'AWER'
  }
};

const mocks = [...keyContactsMock];

describe('SmeModal Component', () => {
  it('should render add key contact when in add mode', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: (
            <SmeModal isOpen closeModal={() => {}} mode="addWithoutCategory" />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(getByText('Add a subject matter expert (SME)')).toBeInTheDocument();
    expect(getByText('Add SME')).toBeInTheDocument();
    expect(
      queryByText('Edit a subject matter expert (SME)')
    ).not.toBeInTheDocument();
  });

  it('should render edit key context when in edit mode', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: (
            <SmeModal
              isOpen
              closeModal={() => {}}
              contact={contact}
              mode="edit"
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(getByText('Edit a subject matter expert (SME)')).toBeInTheDocument();
    expect(getByText('Save changes')).toBeInTheDocument();
    expect(
      queryByText('Add a subject matter expert (SME)')
    ).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: (
            <SmeModal isOpen closeModal={() => {}} mode="addWithoutCategory" />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
