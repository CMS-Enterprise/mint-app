import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  ComponentGroup,
  GetHomepageSettingsDocument,
  ViewCustomizationType
} from 'gql/generated/graphql';

import MessageProvider from 'contexts/MessageContext';

import SelectComponentGroupsSettings from '.';

const mock = (empty: boolean) => {
  return {
    request: {
      query: GetHomepageSettingsDocument
    },
    result: {
      data: {
        __typename: 'Query',
        userViewCustomization: {
          id: '3b29f11e-7dd4-4385-8056-27468d3dd562',
          viewCustomization: [
            ViewCustomizationType.MY_MODEL_PLANS,
            ViewCustomizationType.ALL_MODEL_PLANS
          ],
          solutions: [],
          componentGroups: empty
            ? []
            : [ComponentGroup.CCMI_PCMG, ComponentGroup.CCMI_PPG],
          __typename: 'UserViewCustomization'
        }
      }
    }
  };
};

describe('SelectComponentGroupsSettings', () => {
  it('renders loading state', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/homepage-settings/groups',
          element: (
            <MessageProvider>
              <SelectComponentGroupsSettings />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/homepage-settings/groups']
      }
    );

    render(
      <MockedProvider mocks={[]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
  });

  it('matches snapshot with component groups selected', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/homepage-settings/groups',
          element: (
            <MessageProvider>
              <SelectComponentGroupsSettings />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/homepage-settings/groups']
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={[mock(false)]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('component-groups-add-component-group')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with no component groups selected', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/homepage-settings/groups',
          element: (
            <MessageProvider>
              <SelectComponentGroupsSettings />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/homepage-settings/groups']
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={[mock(true)]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('component-groups-add-component-group')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('displays correct heading, description, label, breadcrumbs and save button', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/homepage-settings/groups',
          element: (
            <MessageProvider>
              <SelectComponentGroupsSettings />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/homepage-settings/groups']
      }
    );

    render(
      <MockedProvider mocks={[mock(false)]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Select groups' })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        'Models owned by a specific CMS component or CMMI group chosen below will show in a tabbed section.'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Components and groups')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Start typing the name or acronym of the component or group.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Breadcrumbs' })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('save-component-group-settings')
    ).toBeInTheDocument();
  });

  it('displays component groups in MultiSelect when present', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/homepage-settings/groups',
          element: (
            <MessageProvider>
              <SelectComponentGroupsSettings />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/homepage-settings/groups']
      }
    );

    render(
      <MockedProvider mocks={[mock(false)]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Selected groups')).toBeInTheDocument();
    });

    // Check that component group tags are displayed
    expect(screen.getByText('CMMI/PCMG')).toBeInTheDocument();
    expect(screen.getByText('CMMI/PPG')).toBeInTheDocument();
  });

  it('renders MultiSelect with correct placeholder when no component groups selected', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/homepage-settings/groups',
          element: (
            <MessageProvider>
              <SelectComponentGroupsSettings />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/homepage-settings/groups']
      }
    );

    render(
      <MockedProvider mocks={[mock(true)]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('component-groups-add-component-group')
      ).toBeInTheDocument();
    });

    // Check that the placeholder shows "0 selected"
    expect(screen.getByText('0 selected')).toBeInTheDocument();
  });
});
