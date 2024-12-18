import React, { useContext, useState } from 'react';
import {
  Controller,
  Form,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  FormGroup,
  Label,
  Select
} from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  useReorderMtoCategoryMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useFormatMTOCategories from 'hooks/useFormatMTOCategories';
import useMessage from 'hooks/useMessage';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type FormValues = {
  newOrder: number;
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
      parentID: categoryID || ''
    }
    // values: {
    //   parentID: parentCategoryID || ''
    // }
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isDirty }
  } = methods;

  const { selectOptionsAndMappedCategories, loading } = useFormatMTOCategories({
    modelID,
    primaryCategory: watch('parentID')
  });

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
        id: subCategoryID,
        newOrder: 0,
        parentID: '1'
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
        {modelToOperationsMiscT('modal.editMilestone.removeDescription')}
      </p>

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
                    className="maxw-none text-bold"
                    requiredMarker
                  >
                    {modelToOperationsMiscT(
                      'modal.milestone.milestoneCategory.label'
                    )}
                  </Label>

                  <Select
                    {...field}
                    id={convertCamelCaseToKebabCase(field.name)}
                    value={field.value || 'default'}
                    defaultValue="default"
                    onChange={e => {
                      field.onChange(e);
                      // Reset subcategory when category changes
                      setValue('parentID', 'default');
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
          </Fieldset>
        </Form>
      </FormProvider>
      <Button
        type="button"
        className="margin-right-4 bg-error"
        // onClick={() => handleRemove()}
      >
        {modelToOperationsMiscT('modal.editMilestone.removeMilestone')}
      </Button>

      <Button type="button" unstyled onClick={() => closeModal()}>
        {modelToOperationsMiscT('modal.editMilestone.goBack')}
      </Button>
    </>
  );
};

export default MoveSubCategoryForm;
