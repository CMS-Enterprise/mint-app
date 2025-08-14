import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import { ArticleCategories, HelpArticle } from '../..';

import ExternalResourceCard from './index'; // Adjust the import to your actual component path

describe('ExternalResourceCard', () => {
  it('renders the component correctly', () => {
    render(
      <MemoryRouter initialEntries={['/help-and-knowledge/articles']}>
        <Route path="/help-and-knowledge/articles">
          <MockedProvider mocks={[]} addTypename={false}>
            <ExternalResourceCard
              type={ArticleCategories.GETTING_STARTED}
              route="https://example.com"
              translation={HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY}
              tag
            />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(screen.getByTestId('article-card')).toBeInTheDocument();
    expect(screen.getByText('External resource')).toBeInTheDocument();
    expect(
      screen.getByText('Quality Vertical health equity resources on SharePoint')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Browse Quality Vertical’s health equity resources, including supplemental guidance on stratification standards ...'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('View on SharePoint')).toBeInTheDocument();
  });

  it('renders the tag when tag prop is true', () => {
    render(
      <MemoryRouter initialEntries={['/help-and-knowledge/articles']}>
        <Route path="/help-and-knowledge/articles">
          <MockedProvider mocks={[]} addTypename={false}>
            <ExternalResourceCard
              type={ArticleCategories.GETTING_STARTED}
              route="https://example.com"
              translation={HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY}
              tag
            />
          </MockedProvider>{' '}
        </Route>
      </MemoryRouter>
    );

    expect(screen.getByText('Getting started')).toBeInTheDocument();
  });

  it('does not render the tag when tag prop is false', () => {
    render(
      <MemoryRouter initialEntries={['/help-and-knowledge/articles']}>
        <Route path="/help-and-knowledge/articles">
          <MockedProvider mocks={[]} addTypename={false}>
            <ExternalResourceCard
              type={ArticleCategories.GETTING_STARTED}
              route="https://example.com"
              translation={HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY}
              tag={false}
            />
          </MockedProvider>{' '}
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.queryByText(ArticleCategories.GETTING_STARTED)
    ).not.toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/help-and-knowledge/articles']}>
        <Route path="/help-and-knowledge/articles">
          <MockedProvider mocks={[]} addTypename={false}>
            <ExternalResourceCard
              type={ArticleCategories.GETTING_STARTED}
              route="https://example.com"
              translation={HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY}
              tag
            />
          </MockedProvider>{' '}
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
