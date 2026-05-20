import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CmmiGroup,
  CmsCenter,
  TranslationDataType,
  TranslationFormType
} from 'gql/generated/graphql';

import {
  CombinedConfigType,
  ModelPlanQuestionsFormTypeWithLinks
} from '../ModelPlanQuestionsForm';

import ExpandableSection from './index';

const mockQuestionGroup = [
  {
    field: 'isNewModel' as const
  }
];

const mockWipeoutQuestionGroup = [
  {
    field: 'cmsCenters' as const
  }
];

const mockConfig = {
  isNewModel: {
    id: 'is-new-model-id',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    label: 'Is this a new model?',
    sublabel: 'Select yes if this is a newly authorized concept.',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  cmsCenters: {
    id: 'cms-centers-id',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    label: 'CMS Centers',
    options: {
      CMMI: 'CMMI',
      CENTER_FOR_MEDICARE: 'Center for Medicare'
    }
  },
  cmmiGroups: {
    id: 'cmmi-groups-id',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    label: 'CMMI Groups',
    options: {
      PATIENT_CARE_MODELS_GROUP: 'Patient Care Models Group'
    }
  }
} as unknown as CombinedConfigType;

const mockComboOptions = [{ value: '12', label: 'A. Existing Model Plan' }];

const FormWrapper = ({
  initialValues = {},
  renderComponent
}: {
  initialValues?: Partial<ModelPlanQuestionsFormTypeWithLinks>;
  renderComponent: (
    control: ReturnType<
      typeof useForm<ModelPlanQuestionsFormTypeWithLinks>
    >['control'],
    setValue: ReturnType<
      typeof useForm<ModelPlanQuestionsFormTypeWithLinks>
    >['setValue']
  ) => React.ReactNode;
}) => {
  const methods = useForm<ModelPlanQuestionsFormTypeWithLinks>({
    defaultValues: {
      isNewModel: null,
      modelCategory: null,
      additionalModelCategories: [],
      cmsCenters: [],
      cmmiGroups: [],
      ...initialValues
    }
  });

  return (
    <FormProvider {...methods}>
      {renderComponent(methods.control, methods.setValue)}
    </FormProvider>
  );
};

describe('ExpandableSection Component', () => {
  it('renders accordion toggle with hidden questions by default', () => {
    render(
      <FormWrapper
        renderComponent={(control, setValue) => (
          <ExpandableSection
            questionGroup={mockQuestionGroup}
            config={mockConfig}
            setValue={setValue}
            control={control}
            comboOptions={mockComboOptions}
          />
        )}
      />
    );

    expect(
      screen.getByText('Update answers (show questions)')
    ).toBeInTheDocument();
    expect(screen.queryByText('Is this a new model?')).not.toBeInTheDocument();
  });

  it('renders nested fields upon expanding the section', async () => {
    render(
      <FormWrapper
        renderComponent={(control, setValue) => (
          <ExpandableSection
            questionGroup={mockQuestionGroup}
            config={mockConfig}
            setValue={setValue}
            control={control}
            comboOptions={mockComboOptions}
          />
        )}
      />
    );

    const toggleButton = screen.getByText('Update answers (show questions)');
    await userEvent.click(toggleButton);

    expect(screen.getByText('Hide questions')).toBeInTheDocument();
    expect(screen.getByText('Is this a new model?')).toBeInTheDocument();
    expect(
      screen.getByText('Select yes if this is a newly authorized concept.')
    ).toBeInTheDocument();
  });

  it('wipes out dependent conditional fields when a parent option is deselected', async () => {
    render(
      <FormWrapper
        initialValues={{
          cmsCenters: [CmsCenter.CMMI],
          cmmiGroups: [CmmiGroup.PATIENT_CARE_MODELS_GROUP]
        }}
        renderComponent={(control, setValue) => (
          <ExpandableSection
            questionGroup={mockWipeoutQuestionGroup}
            config={mockConfig}
            setValue={setValue}
            control={control}
            comboOptions={mockComboOptions}
          />
        )}
      />
    );

    const toggleButton = screen.getByText('Update answers (show questions)');
    await userEvent.click(toggleButton);

    expect(screen.getByLabelText('CMMI')).toBeChecked();
    expect(screen.getByText('CMMI Groups')).toBeInTheDocument();

    const cmmiCheckbox = screen.getByLabelText('CMMI');
    await userEvent.click(cmmiCheckbox);

    expect(cmmiCheckbox).not.toBeChecked();

    await waitFor(() => {
      expect(screen.queryByText('CMMI Groups')).not.toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <FormWrapper
        renderComponent={(control, setValue) => (
          <ExpandableSection
            questionGroup={mockQuestionGroup}
            config={mockConfig}
            setValue={setValue}
            control={control}
            comboOptions={mockComboOptions}
          />
        )}
      />
    );

    const toggleButton = screen.getByText('Update answers (show questions)');
    await userEvent.click(toggleButton);

    expect(asFragment()).toMatchSnapshot();
  });
});
