import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { getByText, render } from '@testing-library/react';

import ModelPlanCard from './index';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mocks = [
  {
    request: {
      query: GetModelCollaboratorsDocument,
      variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
    },
    result: {
      data: {
        modelPlan: mockCollaborator
      }
    }
  }
];

describe('The Model Plan Card component in Collaboration Area', () => {
  it('renders without errors', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ModelPlanCard modelID={modelID} setStatusMessage={() => null} />
      </MockedProvider>
    );
  });

  // it('displays the model plan name', () => {
  //   const modelPlanName = 'Test Model Plan';
  //   const { getByText } = render(<ModelPlanCard name={modelPlanName} />);
  //   expect(getByText(modelPlanName)).toBeInTheDocument();
  // });

  // it('displays the model plan description', () => {
  //   const modelPlanDescription = 'This is a test model plan';
  //   const { getByText } = render(
  //     <ModelPlanCard description={modelPlanDescription} />
  //   );
  //   expect(getByText(modelPlanDescription)).toBeInTheDocument();
  // });

  // it('displays the model plan status', () => {
  //   const modelPlanStatus = 'In Progress';
  //   const { getByText } = render(<ModelPlanCard status={modelPlanStatus} />);
  //   expect(getByText(modelPlanStatus)).toBeInTheDocument();
  // });

  // it('displays the model plan owner', () => {
  //   const modelPlanOwner = 'John Doe';
  //   const { getByText } = render(<ModelPlanCard owner={modelPlanOwner} />);
  //   expect(getByText(modelPlanOwner)).toBeInTheDocument();
  // });
});
