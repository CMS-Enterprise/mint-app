import React from 'react';
import { render, screen } from '@testing-library/react';

import { ArticleCategories, HelpArticle } from '../..';

import ExternalResourceCard from './index'; // Adjust the import to your actual component path

describe('ExternalResourceCard', () => {
  it('renders the component correctly', () => {
    render(
      <ExternalResourceCard
        type={ArticleCategories.GETTING_STARTED}
        route="https://example.com"
        translation={HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY}
        tag
      />
    );

    expect(screen.getByTestId('article-card')).toBeInTheDocument();
    expect(screen.getByText('External Resource')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Quality Vertical health equity resources on SharePoint '
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Browse Quality Vertical’s health equity resources, including supplemental guidance on stratification standards, health equity index proof of concept memo, and more. Additional health equity resources can be found on the Strategy Refresh page.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('View on SharePoint')).toBeInTheDocument();
  });

  it('renders the tag when tag prop is true', () => {
    render(
      <ExternalResourceCard
        type={ArticleCategories.GETTING_STARTED}
        route="https://example.com"
        translation={HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY}
        tag
      />
    );

    expect(
      screen.getByText(ArticleCategories.GETTING_STARTED)
    ).toBeInTheDocument();
  });

  it('does not render the tag when tag prop is false', () => {
    render(
      <ExternalResourceCard
        type={ArticleCategories.GETTING_STARTED}
        route="https://example.com"
        translation={HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY}
        tag={false}
      />
    );

    expect(
      screen.queryByText(ArticleCategories.GETTING_STARTED)
    ).not.toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <ExternalResourceCard
        type={ArticleCategories.GETTING_STARTED}
        route="https://example.com"
        translation={HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY}
        tag
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
