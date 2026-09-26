import React from 'react';
import { render, screen } from '@testing-library/react';
import { CombinedConfigType } from 'features/ModelPlan/AdditionalQuestionnaires/WaiverAssessmentSurvey/_components/ModelPlanQuestionsForm';
import { GeographyType } from 'gql/generated/graphql';
import i18next from 'i18next';

import { basics } from 'i18n/en-US/modelPlan/basics';
import { generalCharacteristics } from 'i18n/en-US/modelPlan/generalCharacteristics';
import { Bool } from 'types/translation';

import WaiverModelQuestionsReadOnlySection from '.';

const defaultEmptyProps = {
  field: 'geographiesTargeted' as keyof CombinedConfigType,
  translations: {
    ...generalCharacteristics,
    ...basics
  },
  values: {
    geographiesTargeted: null as null | Bool,
    geographiesTargetedTypes: null as null | GeographyType[],
    geographiesTargetedTypesOther: ''
  }
};

describe('The Simple Read Only Section', () => {
  describe('As a Non-list Component', () => {
    it('renders without crashing', async () => {
      const data = {
        ...defaultEmptyProps,
        values: {
          ...defaultEmptyProps.values,
          geographiesTargeted: Bool.true
        }
      };

      render(<WaiverModelQuestionsReadOnlySection {...data} />);

      expect(
        screen.getByText(
          i18next.t<string, {}, string>(
            'generalCharacteristics:geographiesTargeted.label'
          )
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('renders "No answer entered" if copy is empty', async () => {
      render(<WaiverModelQuestionsReadOnlySection {...defaultEmptyProps} />);

      expect(
        screen.getByText(
          i18next.t<string, {}, string>(
            'generalCharacteristics:geographiesTargeted.label'
          )
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          i18next.t<string, {}, string>('miscellaneous:notAnswered')
        )
      ).toBeInTheDocument();
    });
  });

  describe('As a List Component', () => {
    it('renders Other entry', async () => {
      const data = {
        ...defaultEmptyProps,
        field: 'geographiesTargetedTypes' as keyof CombinedConfigType,
        values: {
          ...defaultEmptyProps.values,
          geographiesTargeted: Bool.true,
          geographiesTargetedTypes: [GeographyType.REGION, GeographyType.OTHER]
        }
      };

      render(<WaiverModelQuestionsReadOnlySection {...data} />);

      expect(
        screen.getByText(
          i18next.t<string, {}, string>(
            'generalCharacteristics:geographiesTargetedTypes.label'
          )
        )
      ).toBeInTheDocument();

      expect(screen.getByText('Region, Other')).toBeInTheDocument();
    });
  });
});
