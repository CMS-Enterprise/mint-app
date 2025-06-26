import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import { StatusMessageType } from 'features/ModelPlan/TaskList';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import {
  GetCollaborationAreaQuery,
  LockableSection
} from 'gql/generated/graphql';

import { Avatar } from 'components/Avatar';
import Modal from 'components/Modal';
import ShareExportModal from 'components/ShareExport';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useSectionLock from 'hooks/useSectionLock';
import { formatDateLocal } from 'utils/date';

import '../cards.scss';

type TimelineCardType = {
  modelID: string;
  timeline: GetCollaborationAreaQuery['modelPlan']['timeline'];
  setStatusMessage: (message: StatusMessageType) => void;
};

const TimelineCard = ({
  modelID,
  timeline,
  setStatusMessage
}: TimelineCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');
  const timelineT = usePlanTranslation('timeline');

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const history = useHistory();

  const {
    modifiedDts,
    modifiedByUserAccount,
    status,
    datesAddedCount,
    upcomingTimelineDate
  } = timeline;

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
          <span className="text-base">
            {collaborationAreaT('timelineCard.datesAddedCount', {
              datesAddedCount
            })}
          </span>
        </div>

        <CardBody className="padding-bottom-2">
          <p>{collaborationAreaT('timelineCard.body')}</p>
          {upcomingTimelineDate?.date && upcomingTimelineDate.dateField && (
            <div className="display-inline tablet:display-flex margin-top-2 flex-align-center">
              <Trans
                i18nKey="collaborationArea:timelineCard.upcomingDate"
                values={{
                  date: formatDateLocal(
                    upcomingTimelineDate.date,
                    'MM/dd/yyyy'
                  ),
                  dateField:
                    timelineT[
                      upcomingTimelineDate.dateField as keyof typeof timelineT
                    ].label
                }}
                components={{ bold: <strong className="margin-right-1" /> }}
              />
            </div>
          )}
          {modifiedDts && modifiedByUserAccount && (
            <div className="display-inline tablet:display-flex margin-top-2 margin-bottom-2 flex-align-center">
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

          <SectionLock />
        </CardBody>

        <CardFooter>
          <Button
            type="button"
            className="margin-right-2"
            disabled={isLocked}
            onClick={() =>
              history.push(`/models/${modelID}/collaboration-area/timeline`)
            }
            data-testid="to-timeline"
          >
            {modifiedDts
              ? collaborationAreaT('timelineCard.editTimeline')
              : collaborationAreaT('timelineCard.startTimeline')}
          </Button>

          {modifiedDts && (
            <Button
              type="button"
              className="usa-button--outline"
              onClick={() => setIsExportModalOpen(true)}
            >
              {collaborationAreaT('timelineCard.shareButton')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default TimelineCard;
