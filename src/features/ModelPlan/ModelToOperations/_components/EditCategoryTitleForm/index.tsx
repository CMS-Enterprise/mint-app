import React, { useContext } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  useRenameMtoCategoryMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useMessage from 'hooks/useMessage';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type FormValues = {
  name: string;
};

const EditCategoryTitleForm = ({ closeModal }: { closeModal: () => void }) => {
  const { modelID } = useParams<{ modelID: string }>();
  const { t } = useTranslation('modelToOperationsMisc');

  const {
    categoryID,
    subCategoryID,
    categoryName,
    resetCategoryAndSubCategoryID
  } = useContext(MTOModalContext);

  const { showMessage, showErrorMessageInModal, clearMessage } = useMessage();

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

  const [rename] = useRenameMtoCategoryMutation({
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: {
          id: modelID
        }
      }
    ]
  });

  const onSubmit: SubmitHandler<FormValues> = formData => {
    rename({
      variables: {
        id: subCategoryID ?? categoryID,
        name: formData.name
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <Alert
              type="success"
              slim
              data-testid="mandatory-fields-alert"
              className="margin-y-4"
            >
              <span className="mandatory-fields-alert__text">
                <Trans
                  i18nKey={t('modal.editCategoryTitle.alert.success')}
                  components={{
                    b: <span className="text-bold" />
                  }}
                  values={{ title: formData.name }}
                />
              </span>
            </Alert>
          );
        }
        resetCategoryAndSubCategoryID();
        closeModal();
      })
      .catch(() => {
        showErrorMessageInModal(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-bottom-2"
          >
            {t('modal.editCategoryTitle.alert.error')}
          </Alert>
        );
      });
  };

  return (
    <FormProvider {...methods}>
      <Form
        className="maxw-none"
        data-testid="custom-category-form"
        id="custom-category-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Fieldset>
          <Controller
            name="name"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-y-0">
                <p className="margin-y-0 text-bold">
                  {t('modal.editCategoryTitle.label')}
                </p>
                <p className="margin-top-0">{categoryName}</p>

                <Label
                  htmlFor={convertCamelCaseToKebabCase(field.name)}
                  className="mint-body-normal maxw-none margin-top-2"
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
          {t('modal.editCategoryTitle.saveChanges')}
        </Button>
        <Button
          type="button"
          className={`usa-button ${isMobile ? 'usa-button--outline' : 'usa-button--unstyled'}`}
          onClick={() => {
            reset();
            resetCategoryAndSubCategoryID();
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
