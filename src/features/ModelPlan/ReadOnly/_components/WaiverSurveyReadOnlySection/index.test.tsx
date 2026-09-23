import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotSelectedReason } from 'gql/generated/graphql';
import i18next from 'i18next';

import { waiverAssessmentSurvey } from 'i18n/en-US/modelPlan/waiverAssessmentSurvey';
import { Bool } from 'types/translation';

import WaiverAssessmentSurveyReadOnlySections from '.';

const defaultEmptyProps = {
  field: 'modifiesMedicareSavingsPrograms',
  translations: waiverAssessmentSurvey,
  values: {
    modifiesMedicareSavingsPrograms: null as null | Bool,
    modifiesMedicareSavingsProgramsExample: '',
    modifiesMedicareSavingsProgramsWhyNot: null as null | NotSelectedReason
  }
};

describe('The WaiverAssessment Survey Read Only Section', () => {
  it('renders properly', async () => {
    const data = {
      ...defaultEmptyProps,
      values: {
        ...defaultEmptyProps.values,
        modifiesMedicareSavingsPrograms: Bool.true
      }
    };

    render(<WaiverAssessmentSurveyReadOnlySections {...data} />);

    expect(
      screen.getByText(
        i18next.t<string, {}, string>(
          'waiverAssessmentSurvey:modifiesMedicareSavingsPrograms.label'
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('renders "No answer entered" if copy is empty', async () => {
    render(<WaiverAssessmentSurveyReadOnlySections {...defaultEmptyProps} />);

    expect(
      screen.getByText(
        i18next.t<string, {}, string>(
          'waiverAssessmentSurvey:modifiesMedicareSavingsPrograms.label'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string, {}, string>('miscellaneous:notAnswered')
      )
    ).toBeInTheDocument();
  });

  it('renders correct yes answer when provided', async () => {
    const data = {
      ...defaultEmptyProps,
      values: {
        ...defaultEmptyProps.values,
        modifiesMedicareSavingsPrograms: Bool.true,
        modifiesMedicareSavingsProgramsExample: 'Example text'
      }
    };

    render(<WaiverAssessmentSurveyReadOnlySections {...data} />);

    expect(screen.getByText('Yes, Example text')).toBeInTheDocument();
  });

  it('renders correct no answer when provided', async () => {
    const data = {
      ...defaultEmptyProps,
      values: {
        ...defaultEmptyProps.values,
        modifiesMedicareSavingsPrograms: Bool.false,
        modifiesMedicareSavingsProgramsWhyNot: NotSelectedReason.OTHER
      }
    };

    render(<WaiverAssessmentSurveyReadOnlySections {...data} />);

    expect(screen.getByText('No, Other')).toBeInTheDocument();
  });
});
