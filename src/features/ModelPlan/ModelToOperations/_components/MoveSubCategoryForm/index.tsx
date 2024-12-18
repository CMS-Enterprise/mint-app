import React, { useContext, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label,
  Select
} from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  useReorderMtoCategoryMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useFormatMTOCategories from 'hooks/useFormatMTOCategories';
import useMessage from 'hooks/useMessage';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type FormValues = {
  parentID: string;
};

const MoveSubCategoryForm = ({ closeModal }: { closeModal: () => void }) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { categoryID, subCategoryID } = useContext(MTOModalContext);

  const { showMessage } = useMessage();

  const [mutationError, setMutationError] = useState<React.ReactNode | null>();

  const methods = useForm<FormValues>({
    defaultValues: {
      parentID: 'default'
    }
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty }
  } = methods;

  const { selectOptionsAndMappedCategories, loading } = useFormatMTOCategories({
    modelID,
    primaryCategory: watch('parentID')
  });

  const currentCategory =
    selectOptionsAndMappedCategories.find(
      category => category.value === categoryID
    )?.label || '';

  const [updateOrder] = useReorderMtoCategoryMutation({
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: { id: modelID }
      }
    ]
  });

  const onSubmit: SubmitHandler<FormValues> = formData => {
    updateOrder({
      variables: {
        id: subCategoryID || '',
        newOrder: 0,
        parentID: formData.parentID
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <>
              <Alert
                type="success"
                slim
                data-testid="mandatory-fields-alert"
                className="margin-y-4"
              >
                {modelToOperationsMiscT('successReorder')}
              </Alert>
            </>
          );
          setMutationError(null);
          closeModal();
        }
      })
      .catch(() => {
        setMutationError(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-y-4"
          >
            {modelToOperationsMiscT('errorReorderForm')}
          </Alert>
        );
      });
  };

  return (
    <>
      {mutationError && mutationError}

      <p className="margin-top-2 margin-bottom-3">
        {modelToOperationsMiscT('modal.moveSubCategory.description')}
      </p>

      <dt className="text-bold">
        {modelToOperationsMiscT('modal.moveSubCategory.currentCategory')}
      </dt>

      <dd className="margin-0 margin-bottom-2">{currentCategory}</dd>

      <FormProvider {...methods}>
        <Form
          className="maxw-none"
          id="edit-milestone-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Fieldset disabled={loading}>
            <Controller
              name="parentID"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-0 margin-bottom-3">
                  <Label
                    htmlFor={convertCamelCaseToKebabCase(field.name)}
                    className="maxw-none"
                    requiredMarker
                  >
                    {modelToOperationsMiscT(
                      'modal.moveSubCategory.newCategory'
                    )}
                  </Label>

                  <Select
                    {...field}
                    id={convertCamelCaseToKebabCase(field.name)}
                    value={field.value || 'default'}
                    defaultValue="default"
                    onChange={e => {
                      field.onChange(e);
                    }}
                  >
                    {selectOptionsAndMappedCategories.map(option => {
                      return (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </Select>
                </FormGroup>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="margin-right-4"
            >
              {modelToOperationsMiscT('modal.editMilestone.saveChanges')}
            </Button>

            <Button type="button" unstyled onClick={() => closeModal()}>
              {modelToOperationsMiscT('modal.cancel')}
            </Button>
          </Fieldset>
        </Form>
      </FormProvider>
    </>
  );
};

export default MoveSubCategoryForm;
