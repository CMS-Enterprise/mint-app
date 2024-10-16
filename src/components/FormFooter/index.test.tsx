import React from 'react';
import { render } from '@testing-library/react';
import i18next from 'i18next';

import SubmittionFooter from './index';

describe('SubmittionFooter', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment, getByText } = render(
      <SubmittionFooter homeArea="Home" homeRoute="/home" backPage="/back" />
    );

    // Check if the back button is rendered
    expect(getByText(i18next.t('miscellaneous:back'))).toBeInTheDocument();

    // Check if the next button is rendered
    expect(getByText(i18next.t('miscellaneous:next'))).toBeInTheDocument();

    // Check if the home button is rendered
    expect(getByText('Home')).toBeInTheDocument();

    // Create a snapshot
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not render back button when backPage is not provided', () => {
    const { queryByText } = render(
      <SubmittionFooter homeArea="Home" homeRoute="/home" />
    );

    expect(
      queryByText(i18next.t('miscellaneous:back'))
    ).not.toBeInTheDocument();
  });

  it('does not render next button when nextPage is false', () => {
    const { queryByText } = render(
      <SubmittionFooter homeArea="Home" homeRoute="/home" nextPage={false} />
    );

    expect(
      queryByText(i18next.t('miscellaneous:next'))
    ).not.toBeInTheDocument();
  });
});
