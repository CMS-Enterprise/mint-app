import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid
} from '@trussworks/react-uswds';
import { StatusMessageType } from 'features/ModelPlan/TaskList';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import {
  GetModelPlanQuery,
  LockableSection,
  TaskStatus,
  useGetModelPlanQuery,
  UserAccount
} from 'gql/generated/graphql';

import { Avatar } from 'components/Avatar';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import ShareExportModal from 'components/ShareExport';
import Spinner from 'components/Spinner';
import TaskListSectionKeys from 'constants/enums';
import useSectionLock from 'hooks/useSectionLock';
import { getKeys } from 'types/translation';
import { formatDateLocal } from 'utils/date';

import '../cards.scss';

type TimelineCardType = {
  modelID: string;
  timeline: GetModelPlanQuery['modelPlan']['timeline'];
  setStatusMessage: (message: StatusMessageType) => void;
};

const TimelineCard = ({
  modelID,
  timeline,
  setStatusMessage
}: TimelineCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const history = useHistory();

  const { modifiedDts, modifiedByUserAccount, status } = timeline;

  const { SectionLock, isLocked } = useSectionLock({
    section: LockableSection.TIMELINE
  });

  return (
    <>
      <Modal
        isOpen={isExportModalOpen}
        closeModal={() => setIsExportModalOpen(false)}
        className="padding-0 radius-md share-export-modal__container"
        navigation
        shouldCloseOnOverlayClick
      >
        <ShareExportModal
          closeModal={() => setIsExportModalOpen(false)}
          modelID={modelID}
          setStatusMessage={setStatusMessage}
        />
      </Modal>
      <Card
        gridLayout={{ desktop: { col: 6 } }}
        className="collaboration-area__card collaboration-area__main-card"
      >
        <CardHeader>
          <h3 className="usa-card__heading">
            {collaborationAreaT('timelineCard.heading')}
          </h3>
        </CardHeader>
        <div className="collaboration-area__status flex-align-center">
          <TaskListStatusTag status={status} classname="width-fit-content" />
          {/* <span className="text-base">
            {collaborationAreaT('timelineCard.sectionsStarted', {
              sectionsStarted: sectionStartedCounter
            })}
          </span> */}
        </div>

        <CardBody>
          <p>{collaborationAreaT('timelineCard.body')}</p>
        </CardBody>

        {modifiedDts && modifiedByUserAccount && (
          <div className="display-inline tablet:display-flex margin-top-2 margin-bottom-3 flex-align-center padding-x-3">
            <span className="text-base margin-right-1">
              {collaborationAreaT('timelineCard.mostRecentEdit', {
                date: formatDateLocal(modifiedDts, 'MM/dd/yyyy')
              })}
            </span>
            <Avatar
              className="text-base-darkest"
              user={modifiedByUserAccount.commonName}
            />
          </div>
        )}

        <CardFooter>
          <Button
            type="button"
            className="margin-right-2"
            disabled={isLocked}
            onClick={() =>
              history.push(
                `/models/${modelID}/collaboration-area/data-exchange-approach/about-completing-data-exchange`
              )
            }
            data-testid="to-data-exchange-approach"
          >
            {modifiedDts
              ? collaborationAreaT('dataExchangeApproachCard.editApproach')
              : collaborationAreaT('dataExchangeApproachCard.startApproach')}
          </Button>

          <Button
            type="button"
            className="usa-button usa-button--outline"
            onClick={() => setIsExportModalOpen(true)}
          >
            {collaborationAreaT('timelineCard.shareButton')}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default TimelineCard;
