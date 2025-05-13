import React, { useContext } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label,
  Select,
  TextInput
} from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  useCreateMtoMilestoneCustomMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useFormatMTOCategories from 'hooks/useFormatMTOCategories';
import useMessage from 'hooks/useMessage';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type FormValues = {
  primaryCategory: string;
  subcategory: string;
  name: string;
};

const CustomMilestoneForm = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const history = useHistory();

  const location = useLocation();
  // Used to render conditional text in the alert that differs between the Milestone Library and the MTO Matrix
  const isMilestoneLibraryRoute =
    location.pathname.includes('milestone-library');

  const { modelID } = useParams<{ modelID: string }>();

  const { showMessage, showErrorMessageInModal, clearMessage } = useMessage();

  const {
    mtoModalState: { categoryID, subCategoryID, toggleRow },
    setMTOModalOpen
  } = useContext(MTOModalContext);

  const setCategoryRowsOpenOnCreation = (
    category: string,
    subcategory: string
  ) => {
    if (toggleRow) {
      toggleRow(category, true);
      toggleRow(subcategory, true);
    }
  };

  // Variables for the form
  const methods = useForm<FormValues>({
    defaultValues: {
      primaryCategory: categoryID ?? 'default',
      subcategory: subCategoryID ?? 'default',
      name: ''
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid }
  } = methods;

  const {
    selectOptionsAndMappedCategories,
    mappedSubcategories,
    selectOptions,
    loading
  } = useFormatMTOCategories({
    modelID,
    primaryCategory: watch('primaryCategory'),
    hideUncategorized: false
  });

  const [create] = useCreateMtoMilestoneCustomMutation({
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
    let mtoCategoryID;
    const uncategorizedCategoryID = '00000000-0000-0000-0000-000000000000';
    if (formData.subcategory !== uncategorizedCategoryID) {
      mtoCategoryID = formData.subcategory;
    } else if (formData.primaryCategory === uncategorizedCategoryID) {
      mtoCategoryID = null;
    } else {
      mtoCategoryID = formData.primaryCategory;
    }

    create({
      variables: {
        id: modelID,
        name: formData.name,
        mtoCategoryID
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
                <span className="mandatory-fields-alert__text">
                  <Trans
                    i18nKey={t('modal.milestone.alert.success')}
                    components={{
                      b: <span className="text-bold" />
                    }}
                    values={{ milestone: formData.name }}
                  />
                </span>
              </Alert>
            </>
          );
          setCategoryRowsOpenOnCreation(
            formData.primaryCategory,
            formData.subcategory
          );
          setMTOModalOpen(false);
        }
      })
      .catch(() => {
        showErrorMessageInModal(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-bottom-2"
          >
            {t('modal.milestone.alert.error')}
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
        <Fieldset disabled={loading}>
          <Controller
            name="primaryCategory"
            control={control}
            rules={{
              required: true,
              validate: value => value !== 'default'
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor={convertCamelCaseToKebabCase(field.name)}
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {t('modal.milestone.selectPrimaryCategory.label')}
                </Label>

                <Select
                  {...field}
                  id={convertCamelCaseToKebabCase(field.name)}
                  value={field.value || ''}
                  defaultValue="default"
                >
                  {selectOptionsAndMappedCategories.map(option => {
                    return (
                      <option
                        key={`sort-${convertCamelCaseToKebabCase(option.label)}`}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    );
                  })}
                </Select>
              </FormGroup>
            )}
          />

          <Controller
            name="subcategory"
            control={control}
            rules={{
              required: true,
              validate: value => value !== 'default'
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor={convertCamelCaseToKebabCase(field.name)}
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {t('modal.milestone.selectSubcategory.label')}
                </Label>

                <Select
                  {...field}
                  id={convertCamelCaseToKebabCase(field.name)}
                  value={field.value || ''}
                  defaultValue="default"
                  disabled={watch('primaryCategory') === 'default'}
                >
                  {[selectOptions[0], ...mappedSubcategories].map(option => {
                    return (
                      <option
                        key={`sort-${convertCamelCaseToKebabCase(option.label)}`}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    );
                  })}
                </Select>
              </FormGroup>
            )}
          />

          <Controller
            name="name"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor={convertCamelCaseToKebabCase(field.name)}
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {t('modal.milestone.milestoneTitle')}
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
        <Alert type="info" slim className="margin-bottom-8">
          <Trans
            i18nKey={
              isMilestoneLibraryRoute
                ? t('modal.milestone.alert.infoLibrary')
                : t('modal.milestone.alert.info')
            }
            components={{
              milestoneLibrary: (
                <Button
                  type="button"
                  className="usa-button usa-button--unstyled margin-top-0"
                  onClick={() => {
                    reset();
                    clearMessage();
                    setMTOModalOpen(false);
                    history.push({
                      pathname: `/models/${modelID}/collaboration-area/model-to-operations/milestone-library`,
                      state: { scroll: true }
                    });
                  }}
                >
                  {' '}
                </Button>
              )
            }}
          />
        </Alert>
        <div className="mint-modal__footer">
          <Button
            type="submit"
            disabled={!isValid}
            className="margin-right-3 margin-top-0"
          >
            {t('modal.addButton', { type: 'milestone' })}
          </Button>
          <Button
            type="button"
            className="usa-button usa-button--unstyled margin-top-0"
            onClick={() => {
              reset();
              clearMessage();
              setMTOModalOpen(false);
            }}
          >
            {t('modal.cancel')}
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default CustomMilestoneForm;
