import React from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { useRenameMtoCategoryMutation } from 'gql/generated/graphql';

import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useMessage from 'hooks/useMessage';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type FormValues = {
  name: string;
};

const EditCategoryTitleForm = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useTranslation('modelToOperationsMisc');
  const {
    message,
    // showMessage,
    clearMessage
  } = useMessage();
  const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

  const methods = useForm<FormValues>({
    defaultValues: {
      name: ''
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid }
  } = methods;

  const [rename] = useRenameMtoCategoryMutation();

  const onSubmit: SubmitHandler<FormValues> = formData => {
    console.log(formData);
    // rename({
    //   variables: {
    //     id: 'some-id',
    //     name: formData.name
    //   }
    // }).then(() => {
    //   reset();
    //   closeModal();
    // });
  };

  return (
    <FormProvider {...methods}>
      {message}
      <Form
        className="maxw-none"
        data-testid="custom-category-form"
        id="custom-category-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Fieldset
        // disabled={loading}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-y-0">
                <Label
                  htmlFor={convertCamelCaseToKebabCase(field.name)}
                  className="mint-body-normal maxw-none"
                  requiredMarker
                >
                  {t('modal.editCategoryTitle.newTitle')}
                </Label>

                <TextInput
                  type="text"
                  {...field}
                  id={convertCamelCaseToKebabCase(field.name)}
                  value={field.value || ''}
                />
              </FormGroup>
            )}
          />
        </Fieldset>
        <Button type="submit" disabled={!isValid} className="margin-right-3">
          {t('modal.addButton', { type: 'category' })}
        </Button>
        <Button
          type="button"
          className={`usa-button ${isMobile ? 'usa-button--outline' : 'usa-button--unstyled'}`}
          onClick={() => {
            reset();
            clearMessage();
            closeModal();
          }}
        >
          {t('modal.cancel')}
        </Button>
      </Form>
    </FormProvider>
  );
};

export default EditCategoryTitleForm;
