import React, { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Grid,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import {
  HelpSolutionBaseType,
  helpSolutions
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  GetModelToOperationsMatrixDocument,
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  useGetModelToOperationsMatrixQuery,
  useGetMtoMilestoneQuery,
  useUpdateMtoMilestoneMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';
import useFormatMTOCategories from 'hooks/useFormatMTOCategories';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';

import { MilestoneCardType } from '../../MilestoneLibrary';
import { GetModelToOperationsMatrixQueryType } from '../Table';
import { MilestoneType } from '../Table/columns';

import '../../index.scss';

type FormValues = {
  name: string;
  primaryCategory: string;
  subcategory: string;
  facilitatedBy: MtoFacilitator[];
  needBy: string;
  status: MtoMilestoneStatus;
  riskIndicator: MtoRiskIndicator;
  isDraft: boolean;
};

type EditMilestoneFormProps = {
  closeModal: () => void;
};

const EditMilestoneForm = ({ closeModal }: EditMilestoneFormProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const history = useHistory();

  const { modelID } = useParams<{ modelID: string }>();

  const params = useMemo(
    () => new URLSearchParams(history.location.search),
    [history]
  );

  const editMilestoneID = params.get('edit-milestone');

  const { message, showMessage, clearMessage } = useMessage();

  const { data, loading, error } = useGetMtoMilestoneQuery({
    variables: {
      id: editMilestoneID || ''
    }
  });

  const milestone = useMemo(() => {
    return data?.mtoMilestone;
  }, [data]);

  // Variables for the form
  const methods = useForm<FormValues>({
    defaultValues: {
      primaryCategory: 'default',
      subcategory: 'default',
      name: ''
    }
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
    selectOptions
  } = useFormatMTOCategories({
    modelID,
    primaryCategory: watch('primaryCategory')
  });

  const [updateMilestone] = useUpdateMtoMilestoneMutation({
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

    const { primaryCategory, subcategory, ...formChanges } = formData;

    updateMilestone({
      variables: {
        id: modelID,
        changes: {
          ...formChanges,
          mtoCategoryID
        }
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
          closeModal();
        }
      })
      .catch(() => {
        showMessage(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-y-4"
          >
            {t('modal.milestone.alert.error')}
          </Alert>
        );
      });
  };

  if (loading) {
    return <PageLoading />;
  }

  if (!milestone || error) {
    return null;
  }

  return (
    <>
      <GridContainer className="padding-8">
        <Grid row>
          <Grid col={12}>
            {!milestone.addedFromMilestoneLibrary && (
              <span className="padding-right-1 model-to-operations__milestone-tag padding-y-05">
                <Icon.LightbulbOutline
                  className="margin-left-1"
                  style={{ top: '2px' }}
                />{' '}
                {t('milestoneLibrary.suggested')}
              </span>
            )}

            {milestone.isDraft && (
              <span className="padding-right-1 model-to-operations__is-draft-tag padding-y-05">
                <Icon.Science
                  className="margin-left-1"
                  style={{ top: '2px' }}
                />{' '}
                {t('milestoneLibrary.isDraft')}
              </span>
            )}

            <h2 className="margin-y-2 line-height-large">{milestone.name}</h2>

            {/* <p className="text-base-dark margin-top-0 margin-bottom-2">
              {t('milestoneLibrary.category', {
                category: milestone.categoryName
              })}{' '}
              {milestone.subCategoryName && ` (${milestone.subCategoryName})`}
            </p> */}

            <p>
              {t(`milestoneLibrary.milestoneMap.${milestone.key}.description`)}
            </p>

            <h3 className="margin-y-2">
              {t('milestoneLibrary.commonSolutions')}
            </h3>
          </Grid>
        </Grid>
      </GridContainer>
    </>
  );
};

export default EditMilestoneForm;
