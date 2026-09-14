import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CmmiGroup,
  CmsCenter,
  ModelCategory,
  YesNoOtherType
} from 'gql/generated/graphql';
import { modelID, modelPlanQuestionsDataMocks } from 'tests/mock/general';

import ModelPlanQuestionsForm, { ModelPlanQuestionsDataType } from './index';

const mockModelPlanQuestionsData: ModelPlanQuestionsDataType = {
  basicsId: 'basics-123',
  generalCharacteristicsId: 'char-456',
  modelCategory: ModelCategory.ACCOUNTABLE_CARE,
  additionalModelCategories: [ModelCategory.DISEASE_SPECIFIC_AND_EPISODIC],
  cmsCenters: [CmsCenter.CMMI],
  cmmiGroups: [CmmiGroup.PATIENT_CARE_MODELS_GROUP],
  isNewModel: true,
  resemblesExistingModel: YesNoOtherType.YES,
  resemblesExistingModelWhyHow: 'This is an integrated testing description.',
  resemblesExistingModelHow: '',
  resemblesExistingModelOtherSpecify: '',
  resemblesExistingModelOtherSelected: false,
  resemblesExistingModelOtherOption: '',
  participationInModelPrecondition: null,
  participationInModelPreconditionOtherSpecify: '',
  participationInModelPreconditionOtherSelected: false,
  participationInModelPreconditionOtherOption: '',
  participationInModelPreconditionWhyHow: '',
  keyCharacteristics: [],
  keyCharacteristicsOther: '',
  collectPlanBids: null,
  managePartCDEnrollment: null,
  planContractUpdated: null,
  geographiesTargeted: null,
  geographiesTargetedTypes: [],
  geographiesStatesAndTerritories: [],
  geographiesRegionTypes: [],
  geographiesTargetedTypesOther: '',
  geographiesTargetedAppliedTo: [],
  geographiesTargetedAppliedToOther: '',
  waiversRequired: null,
  waiversRequiredTypes: [],
  currentModelPlanID: 'uuid-mint-1',
  existingModelID: null,
  resemblesExistingModelWhich: {
    __typename: 'ExistingModelLinks',
    links: [
      {
        __typename: 'ExistingModelLink',
        existingModelID: 12,
        currentModelPlanID: null
      }
    ]
  },
  participationInModelPreconditionWhich: null
};

const mockModelPlanOptions = [
  { label: 'A. Existing Model Plan', value: '12' },
  { label: 'B. MINT Model Plan', value: 'uuid-mint-1' }
];

describe('ModelPlanQuestionsForm Component', () => {
  const createFormElement = (data: ModelPlanQuestionsDataType) => {
    return (
      <MockedProvider mocks={[]} addTypename={false}>
        <ModelPlanQuestionsForm
          modelPlanQuestionsData={data}
          modelPlanOptions={mockModelPlanOptions}
          mintModelPlanCollection={
            modelPlanQuestionsDataMocks.modelPlanCollection
          }
          existingModelCollection={
            modelPlanQuestionsDataMocks.existingModelCollection
          }
        />
      </MockedProvider>
    );
  };

  const setupFormRouter = (initialElement: React.ReactElement) => {
    return createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/waiver-assessment-survey/model-plan-questions',
          element: initialElement
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/model-plan-questions`
        ]
      }
    );
  };

  it('renders form questions accordingly', () => {
    const initialElement = createFormElement(mockModelPlanQuestionsData);
    const router = setupFormRouter(initialElement);

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(screen.getByText('Primary model category')).toBeInTheDocument();
    expect(screen.getByText('Accountable Care')).toBeInTheDocument();

    expect(
      screen.getByText('This is an integrated testing description.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Save and return to questionnaires')
    ).toBeInTheDocument();
  });

  it('clears sub field values when parent value are changed', async () => {
    const initialElement = createFormElement(mockModelPlanQuestionsData);
    const router = setupFormRouter(initialElement);

    const { rerender } = render(<RouterProvider router={router} />);

    expect(
      screen.getByText('Disease-Specific & Episode-Based')
    ).toBeInTheDocument();

    const updatedMockData: ModelPlanQuestionsDataType = {
      ...mockModelPlanQuestionsData,
      additionalModelCategories: [ModelCategory.HEALTH_PLAN]
    };

    const updatedElement = (
      <MockedProvider mocks={[]} addTypename={false}>
        <ModelPlanQuestionsForm
          key="updated-form-state"
          modelPlanQuestionsData={updatedMockData}
          modelPlanOptions={mockModelPlanOptions}
          mintModelPlanCollection={
            modelPlanQuestionsDataMocks.modelPlanCollection
          }
          existingModelCollection={
            modelPlanQuestionsDataMocks.existingModelCollection
          }
        />
      </MockedProvider>
    );

    const updatedRouter = setupFormRouter(updatedElement);
    rerender(<RouterProvider router={updatedRouter} />);

    await waitFor(() => {
      expect(
        screen.queryByText('Disease-Specific & Episode-Based')
      ).not.toBeInTheDocument();
    });
  });

  it('matches snapshot', () => {
    const initialElement = createFormElement(mockModelPlanQuestionsData);
    const router = setupFormRouter(initialElement);

    const { asFragment } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
