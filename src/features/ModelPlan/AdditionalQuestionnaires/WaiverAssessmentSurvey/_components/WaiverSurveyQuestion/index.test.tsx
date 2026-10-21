import React from 'react';
import { useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import usePlanTranslation from 'hooks/usePlanTranslation';

import WaiverSurveyQuestion from './index';

const TestFormWrapper = ({
  initialValue
}: {
  initialValue: boolean | null;
}) => {
  const methods = useForm({
    defaultValues: {
      modifiesMedicareSavingsPrograms: initialValue,
      modifiesMedicareSavingsProgramsExample: '',
      modifiesMedicareSavingsProgramsWhyNot: ''
    }
  });

  const {
    modifiesMedicareSavingsPrograms: modifiesMedicareSavingsProgramsConfig
  } = usePlanTranslation('waiverAssessmentSurvey');

  const parentValue = methods.watch('modifiesMedicareSavingsPrograms');

  return (
    <WaiverSurveyQuestion
      fieldName="modifiesMedicareSavingsPrograms"
      questionConfig={modifiesMedicareSavingsProgramsConfig}
      value={parentValue}
      methods={methods}
    />
  );
};

describe('WaiverSurveyQuestion Component', () => {
  it('toggles child elements on click', async () => {
    const user = userEvent.setup();
    render(<TestFormWrapper initialValue={null} />);

    expect(
      screen.queryByText('Please provide an example')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Please explain why not')
    ).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Yes'));
    expect(screen.getByText('Please provide an example')).toBeInTheDocument();

    await user.click(screen.getByLabelText('No'));
    expect(
      screen.queryByText('Please provide an example')
    ).not.toBeInTheDocument();
    expect(screen.getByText('Please explain why not')).toBeInTheDocument();
  });
});
