import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import {
  useCreateStandardCategoriesMutation,
  useGetMtoCommonSolutionsQuery,
  useGetMtoMilestonesQuery
} from 'gql/generated/graphql';

import useMessage from 'hooks/useMessage';

import MTOModal from '../../Modal';

import './index.scss';

const MTOTableActions = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const history = useHistory();
  const { modelID } = useParams<{ modelID: string }>();

  const { clearMessage } = useMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);

  const [create] = useCreateStandardCategoriesMutation({
    variables: { modelPlanID: modelID }
  });

  const [modalType, setModalType] = useState<
    'category' | 'milestone' | 'solution'
  >('category');

  const { data: milestoneData } = useGetMtoMilestonesQuery({
    variables: { id: modelID }
  });

  const { data: solutionData } = useGetMtoCommonSolutionsQuery({
    variables: { id: modelID }
  });

  const handleCreate = () => {
    create().then(response => {
      if (!response?.errors) {
        // TODO: Add success message
        // alert('Standard categories created successfully');
      }
    });
  };

  return (
    <>
      <MTOModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        modalType={modalType}
      />
      <div className="border-1px radius-md border-gray-10 padding-3">
        <div className="action-bar display-flex">
          <p className="margin-y-0 text-bold">
            {t('table.tableActions.tableActions')}
          </p>
          <div className="margin-x-2 padding-y-05">
            <div className="border-right-2px border-base-light height-full" />
          </div>
          <Button
            type="button"
            unstyled
            onClick={() => setActionsMenuOpen(!actionsMenuOpen)}
          >
            {actionsMenuOpen ? (
              <>
                {t('table.tableActions.hideActions')}
                <Icon.ExpandLess />
              </>
            ) : (
              <>
                {t('table.tableActions.showActions')}
                <Icon.ExpandMore />
              </>
            )}
          </Button>
        </div>
        {actionsMenuOpen && (
          <div className="action-buttons margin-top-3">
            {/* Milestone Buttons */}
            <div className="action-button--milestone">
              <div className="width-fit-content">
                <div className="display-flex flex-align-center">
                  <div
                    style={{ height: '20px', width: '20px' }}
                    className="margin-right-1 bg-green-5 radius-sm display-flex flex-align-center flex-justify-center"
                  >
                    <Icon.Flag
                      style={{
                        fill: '#607F35'
                      }}
                    />
                  </div>
                  <p className="margin-y-0 text-bold">
                    {t('table.tableActions.milestones')}
                  </p>
                </div>
                <p className="margin-top-0">
                  {t('table.tableActions.commonMilestones', {
                    number:
                      milestoneData?.modelPlan?.mtoMatrix?.commonMilestones
                        ?.length
                  })}
                </p>

                <Button
                  type="button"
                  className="display-block margin-bottom-1"
                  outline
                  onClick={() => {
                    history.push(
                      `/models/${modelID}/collaboration-area/model-to-operations/milestone-library`
                    );
                  }}
                >
                  {t('table.tableActions.browseMilestoneLibrary')}
                </Button>
                <Button
                  type="button"
                  className="display-block"
                  unstyled
                  onClick={() => {
                    clearMessage();
                    setModalType('milestone');
                    setIsModalOpen(true);
                  }}
                >
                  {t('optionsCard.milestones.linkText')}
                </Button>
              </div>
            </div>

            {/* Operational Solution Buttons */}
            <div className="action-button--solution">
              <div className="width-fit-content">
                <div className="display-flex flex-align-center">
                  <div
                    className="margin-right-1 radius-sm display-flex flex-align-center flex-justify-center"
                    style={{
                      height: '20px',
                      width: '20px',
                      backgroundColor: '#E1E6F9'
                    }}
                  >
                    <Icon.Build
                      style={{
                        fill: '#3F57A6'
                      }}
                    />
                  </div>
                  <p className="margin-y-0 text-bold">
                    {t('table.tableActions.operationalSolutions')}
                  </p>
                </div>
                <p className="margin-top-0">
                  {t('table.tableActions.commonSolutions', {
                    number:
                      solutionData?.modelPlan?.mtoMatrix?.commonSolutions
                        ?.length
                  })}
                </p>

                <Button
                  type="button"
                  className="display-block margin-bottom-1"
                  outline
                  onClick={() => {
                    history.push(
                      `/models/${modelID}/collaboration-area/model-to-operations/solution-library`
                    );
                  }}
                >
                  {t('table.tableActions.browseSolutionLibrary')}
                </Button>
                <Button
                  type="button"
                  className="display-block"
                  unstyled
                  onClick={() => {
                    clearMessage();
                    setModalType('solution');
                    setIsModalOpen(true);
                  }}
                >
                  {t('optionsCard.systems-and-solutions.linkText')}
                </Button>
              </div>
            </div>

            {/* Template and Categories Buttons */}
            <div className="action-button--category">
              <div className="display-flex flex-align-center">
                <div
                  className="margin-right-1 radius-sm display-flex flex-align-center flex-justify-center"
                  style={{
                    height: '20px',
                    width: '20px',
                    backgroundColor: '#DFE1E2'
                  }}
                >
                  <Icon.GridView
                    style={{
                      fill: '#565C65'
                    }}
                  />
                </div>
                <p className="margin-y-0 text-bold">
                  {t('table.tableActions.templateAndCategories')}
                </p>
              </div>
              <p className="margin-top-0">
                {t('table.tableActions.availableTemplates')}
              </p>
              <div
                className="display-flex flex-justify bg-base-lightest border border-gray-10 padding-x-2 padding-y-1 radius-md shadow-2 margin-bottom-1"
                style={{ gap: '24px' }}
              >
                <span className="text-bold">
                  {t('table.tableActions.standardCategories')}
                </span>
                <Button
                  type="button"
                  className="display-block"
                  unstyled
                  onClick={() => {
                    handleCreate();
                  }}
                >
                  {t('table.tableActions.addThisTemplate')}
                </Button>
              </div>

              <Button
                type="button"
                className="display-block"
                unstyled
                onClick={() => {
                  clearMessage();
                  setModalType('category');
                  setIsModalOpen(true);
                }}
              >
                {t('table.tableActions.addCustomCategory')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MTOTableActions;
