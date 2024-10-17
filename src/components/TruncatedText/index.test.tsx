import React from 'react';
import { render } from '@testing-library/react';
import { GetModelPlanBaseDocument } from 'gql/generated/graphql';
import VerboseMockedProvider from 'tests/MockedProvider';

import TruncatedText from './index';

const mocks = [
  {
    request: {
      query: GetModelPlanBaseDocument,
      variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
    },
    result: {
      data: {
        modelPlan: {}
      }
    }
  }
];

const textString =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus sit minima dolor asperiores pariatur deleniti blanditiis sint dolorem, laboriosam corporis labore culpa tenetur est quaerat.<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>';

describe('The TruncatedText component', () => {
  it('truncates text according to character count', () => {
    const { getByText } = render(
      <VerboseMockedProvider mocks={mocks} addTypename={false}>
        <TruncatedText id="test" text={textString} charLimit={50} />
      </VerboseMockedProvider>
    );

    expect(getByText('Read more')).toBeInTheDocument();
    expect(getByText(`${textString.substring(0, 50)} ...`)).toBeInTheDocument();
  });

  it('truncates text according to line clamp', async () => {
    const { getByText, getByTestId } = render(
      <VerboseMockedProvider mocks={mocks} addTypename={false}>
        <TruncatedText id="test" text={textString} lineClamp={2} />
      </VerboseMockedProvider>
    );

    expect(getByText('Read more')).toBeInTheDocument();
    expect(getByTestId('truncated-text')).toHaveStyle('--line-clamp: 2');
  });

  it('matches charLimit snapshot', () => {
    const { getByText, asFragment } = render(
      <VerboseMockedProvider mocks={mocks} addTypename={false}>
        <TruncatedText id="test" text={textString} charLimit={50} />
      </VerboseMockedProvider>
    );
    expect(getByText('Read more')).toBeInTheDocument();
    expect(getByText(`${textString.substring(0, 50)} ...`)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches lineClamp snapshot', () => {
    const { getByText, asFragment } = render(
      <VerboseMockedProvider mocks={mocks} addTypename={false}>
        <TruncatedText id="test" text={textString} lineClamp={2} />
      </VerboseMockedProvider>
    );
    expect(getByText('Read more')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
