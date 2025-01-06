import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';

import { MilestoneCardType } from '../../MilestoneLibrary';
import AddSolutionToMilestoneForm from '../AddCommonMilestoneForm';
import SuggestedMilestoneToggle from '../SuggestedMilestoneToggle';

import '../../index.scss';

const MilestoneCard = ({
  className,
  milestone,
  setIsSidepanelOpen
}: {
  className?: string;
  milestone: MilestoneCardType;
  setIsSidepanelOpen: (isOpen: boolean) => void;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const history = useHistory();

  const { errorMessageInModal, clearMessage } = useMessage();

  const params = useMemo(
    () => new URLSearchParams(history.location.search),
    [history]
  );

  const milestoneParam = params.get('add-milestone');

  const [isModalOpen, setIsModalOpen] = useState(
    milestoneParam === milestone.key
  );

  useEffect(() => {
    if (milestoneParam === milestone.key) {
      setIsModalOpen(true);
    }
  }, [milestoneParam, milestone.key, setIsModalOpen]);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        closeModal={() => {
          params.delete('add-milestone', milestone.key);
          params.delete('milestone', milestone.key);
          history.replace({ search: params.toString() });
          clearMessage();
          setIsModalOpen(false);
        }}
        shouldCloseOnOverlayClick
        className="tablet:width-mobile-lg mint-body-normal"
      >
        <div className="margin-bottom-2">
          <PageHeading headingLevel="h3" className="margin-y-0">
            {t('modal.solutionToMilestone.title')}
          </PageHeading>
        </div>

        {errorMessageInModal}

        <AddSolutionToMilestoneForm
          closeModal={() => {
            params.delete('add-milestone', milestone.key);
            params.delete('milestone', milestone.key);
            history.replace({ search: params.toString() });
            clearMessage();
            setIsModalOpen(false);
          }}
          milestone={milestone}
        />
      </Modal>

      <Card
        containerProps={{
          className: 'radius-md minh-mobile padding-0 margin-0'
        }}
        className={classNames(className, 'margin-bottom-2')}
      >
        <CardHeader className="padding-3 padding-bottom-0">
          <div className="display-flex flex-justify">
            <span className="text-base-dark">
              {t('milestoneLibrary.milestone')}
            </span>
            {milestone.isSuggested && (
              <span className="padding-right-1 model-to-operations__milestone-tag">
                <Icon.LightbulbOutline
                  className="margin-left-1"
                  style={{ top: '2px' }}
                />{' '}
                {t('milestoneLibrary.suggested')}
              </span>
            )}
          </div>
          <h3 className="line-height-normal margin-top-1">{milestone.name}</h3>
        </CardHeader>

        <CardBody className="padding-x-3 ">
          <div className="text-base-dark">
            {t('milestoneLibrary.category', {
              category: milestone.categoryName
            })}{' '}
            {milestone.subCategoryName && ` (${milestone.subCategoryName})`}
          </div>

          {milestone.isSuggested && (
            <SuggestedMilestoneToggle
              milestone={milestone}
              className="margin-top-2"
            />
          )}
        </CardBody>

        <CardFooter className="padding-3">
          {!milestone.isAdded ? (
            <Button
              type="button"
              outline
              className="margin-right-2"
              onClick={() => {
                params.delete('milestone');
                params.set('add-milestone', milestone.key);
                history.replace({ search: params.toString() });
                setIsModalOpen(true);
              }}
            >
              {t('milestoneLibrary.addToMatrix')}
            </Button>
          ) : (
            <Button
              type="button"
              disabled
              className="margin-right-2 model-to-operations__milestone-added text-normal"
            >
              <Icon.Check />
              {t('milestoneLibrary.added')}
            </Button>
          )}

          <Button
            unstyled
            type="button"
            className="margin-top-2"
            onClick={() => {
              setIsSidepanelOpen(true);
              params.set('milestone', milestone.key);
              history.push({ search: params.toString() });
            }}
          >
            {t('milestoneLibrary.aboutThisMilestone')}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default MilestoneCard;
