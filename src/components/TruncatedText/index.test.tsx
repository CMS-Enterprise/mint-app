import React from 'react';
import { render } from '@testing-library/react';
import {
  GetOverviewDocument,
  GetOverviewQuery,
  ModelType
} from 'gql/generated/graphql';
import VerboseMockedProvider from 'tests/MockedProvider';

import TruncatedText from './index';

type GetOverviewType = GetOverviewQuery['modelPlan']['basics'];

const overviewMockData: GetOverviewType = {
  __typename: 'PlanBasics',
  id: '123',
  modelType: [ModelType.MANDATORY_NATIONAL],
  modelTypeOther: 'Other model type',
  problem: 'My problem',
  goal: 'A goal',
  testInterventions: 'Intervention',
  note: 'Test note'
};

const mocks = [
  {
    request: {
      query: GetOverviewDocument,
      variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: 'f11eb129-2c80-4080-9440-439cbe1a286f',
          modelName: 'My excellent plan that I just initiated',
          basics: overviewMockData
        }
      }
    }
  }
];

const textString =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus sit minima dolor asperiores pariatur deleniti blanditiis sint dolorem, laboriosam corporis labore culpa tenetur est quaerat.<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>';

describe('The TruncatedText component', () => {
  it.skip('truncates text according to character count', () => {
    const { getByText } = render(
      <VerboseMockedProvider mocks={mocks} addTypename={false}>
        <TruncatedText id="test" text={textString} charLimit={50} />
      </VerboseMockedProvider>
    );

    expect(getByText('Read more')).toBeInTheDocument();
    expect(getByText(`${textString.substring(0, 50)} ...`)).toBeInTheDocument();
  });

  it('truncates text according to line clamp', () => {
    const { getByText } = render(
      <VerboseMockedProvider mocks={mocks} addTypename={false}>
        <TruncatedText id="test" text={textString} lineClamp={1} />
      </VerboseMockedProvider>
    );

    expect(getByText('Read more')).toBeInTheDocument();
    // expect(getByText(`${textString.substring(0, 50)} ...`)).toBeInTheDocument();
  });

  it.skip('matches snapshot', () => {
    const { getByText, asFragment } = render(
      <VerboseMockedProvider mocks={mocks} addTypename={false}>
        <TruncatedText id="test" text={textString} charLimit={50} />
      </VerboseMockedProvider>
    );
    expect(getByText('Read more')).toBeInTheDocument();
    expect(getByText(`${textString.substring(0, 50)} ...`)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
