import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import { ArticleCategories, HelpArticle } from '../..';

import ExternalResourceCard from './index'; // Adjust the import to your actual component path

describe('ExternalResourceCard', () => {
  it('renders the component correctly', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/articles',
          element: (
            <ExternalResourceCard
              type={ArticleCategories.GETTING_STARTED}
              route="https://example.com"
              translation={HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY}
              tag
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/articles']
      }
    );

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(screen.getByTestId('article-card')).toBeInTheDocument();
    expect(screen.getByText('External resource')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Quality Vertical healthy living resources on SharePoint'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Browse Quality Vertical’s healthy living resources, including supplemental guidance on stratification standard ...'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('View on SharePoint')).toBeInTheDocument();
  });

  it('renders the tag when tag prop is true', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/articles',
          element: (
            <ExternalResourceCard
              type={ArticleCategories.GETTING_STARTED}
              route="https://example.com"
              translation={HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY}
              tag
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/articles']
      }
    );

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(screen.getByText('Getting started')).toBeInTheDocument();
  });

  it('does not render the tag when tag prop is false', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/articles',
          element: (
            <ExternalResourceCard
              type={ArticleCategories.GETTING_STARTED}
              route="https://example.com"
              translation={HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY}
              tag={false}
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/articles']
      }
    );

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(
      screen.queryByText(ArticleCategories.GETTING_STARTED)
    ).not.toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/articles',
          element: (
            <ExternalResourceCard
              type={ArticleCategories.GETTING_STARTED}
              route="https://example.com"
              translation={HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY}
              tag
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/articles']
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
