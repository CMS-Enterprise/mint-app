import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
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

import { MilestoneCardType } from '../../MilestoneLibrary';
import AddSolutionToMilestoneForm from '../AddCommonMilestoneForm';
import SuggestedMilestoneToggle from '../SuggestedMilestoneToggle';

import '../../index.scss';

const MilestoneCard = ({
  className,
  milestone,
  setIsSidepanelOpen,
  isHkcMilestoneLibrary
}: {
  className?: string;
  milestone: MilestoneCardType;
  setIsSidepanelOpen: (isOpen: boolean) => void;
  isHkcMilestoneLibrary: boolean;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');
  const { t: hkcT } = useTranslation('helpAndKnowledge');

  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);

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
          navigate({ search: params.toString() }, { replace: true });
          setIsModalOpen(false);
        }}
        fixed
        className="tablet:width-mobile-lg mint-body-normal"
      >
        <div className="margin-bottom-2">
          <PageHeading headingLevel="h3" className="margin-y-0">
            {t('modal.solutionToMilestone.title')}
          </PageHeading>
        </div>

        <AddSolutionToMilestoneForm
          closeModal={() => {
            params.delete('add-milestone', milestone.key);
            navigate({ search: params.toString() }, { replace: true });
            setIsModalOpen(false);
          }}
          milestone={milestone}
        />
      </Modal>

      <Card
        containerProps={{
          className: classNames('radius-md padding-0 margin-0', {
            'minh-mobile': !isHkcMilestoneLibrary
          }),
          style: isHkcMilestoneLibrary ? { minHeight: '260px' } : {}
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
                  aria-label="lightbulb"
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

        {isHkcMilestoneLibrary && (
          <CardFooter className="padding-3">
            <Button
              unstyled
              type="button"
              className="margin-right-1 deep-underline"
              onClick={() => {
                setIsSidepanelOpen(true);
                params.set('milestone', milestone.key);
                navigate({ search: params.toString() });
              }}
            >
              {hkcT('milestoneLibrary.learnAboutThisMilestone')}
            </Button>
            <Icon.ArrowForward
              className="top-3px text-primary"
              aria-label="forward"
            />
          </CardFooter>
        )}

        {!isHkcMilestoneLibrary && (
          <CardFooter className="padding-3">
            {!milestone.isAdded ? (
              <Button
                type="button"
                outline
                className="margin-right-2"
                onClick={() => {
                  params.delete('milestone');
                  params.set('add-milestone', milestone.key);
                  navigate({ search: params.toString() }, { replace: true });
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
                <Icon.Check aria-label="check" />
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
                navigate({ search: params.toString() });
              }}
            >
              {t('milestoneLibrary.aboutThisMilestone')}
            </Button>
          </CardFooter>
        )}
      </Card>
    </>
  );
};

export default MilestoneCard;
