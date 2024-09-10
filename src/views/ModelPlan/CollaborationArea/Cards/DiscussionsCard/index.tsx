import React, { useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import { GetModelPlanQuery } from 'gql/gen/graphql';

import Discussions from 'views/ModelPlan/Discussions';
import DiscussionModalWrapper from 'views/ModelPlan/Discussions/DiscussionModalWrapper';

import '../../index.scss';

type DiscussionsType = GetModelPlanQuery['modelPlan']['discussions'][0];

type DiscussionsCardType = {
  discussions: DiscussionsType[];
  modelID: string;
};

const DiscussionsCard = ({ discussions, modelID }: DiscussionsCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const location = useLocation();

  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  // Get discussionID from generated email link
  const discussionID = params.get('discussionID');

  const [isDiscussionOpen, setIsDiscussionOpen] = useState<boolean>(false);
  const [discussionType, setDiscussionType] = useState<'start' | 'viewAll'>(
    'start'
  );

  useEffect(() => {
    if (discussionID) setIsDiscussionOpen(true);
  }, [discussionID]);

  return (
    <>
      {/* Discussion modal */}
      {isDiscussionOpen && (
        <DiscussionModalWrapper
          isOpen={isDiscussionOpen}
          closeModal={() => setIsDiscussionOpen(false)}
        >
          <Discussions
            modelID={modelID}
            discussionID={discussionID}
            askAQuestion={discussionType === 'start'}
          />
        </DiscussionModalWrapper>
      )}

      <Card
        gridLayout={{ mobile: { col: 12 }, desktop: { col: 4 } }}
        className="collaboration-area__card card--discussions"
      >
        <CardHeader>
          <h3 className="usa-card__heading">
            {collaborationAreaT('discussionsCard.heading')}
          </h3>
        </CardHeader>

        <CardBody>
          {discussions?.length === 0 ? (
            <p>{collaborationAreaT('discussionsCard.noDiscussions')}</p>
          ) : (
            <div className="display-flex flex-align-center">
              <Icon.Forum size={3} className="margin-right-1" />

              {collaborationAreaT('discussionsCard.discussion', {
                count: discussions?.length
              })}
            </div>
          )}
        </CardBody>

        <CardFooter>
          <Button
            type="button"
            onClick={() => {
              // Send a discussion open event to GA
              ReactGA.send({
                hitType: 'event',
                eventCategory: 'discussion_center_opened',
                eventAction: 'click',
                eventLabel: 'Discussion Center opened'
              });
              setDiscussionType('start');
              setIsDiscussionOpen(true);
            }}
          >
            {collaborationAreaT('discussionsCard.startDiscussion')}
          </Button>

          {discussions?.length !== 0 && (
            <Button
              type="button"
              outline
              onClick={() => {
                // Send a discussion open event to GA
                ReactGA.send({
                  hitType: 'event',
                  eventCategory: 'discussion_center_opened',
                  eventAction: 'click',
                  eventLabel: 'Discussion Center opened'
                });
                setDiscussionType('viewAll');
                setIsDiscussionOpen(true);
              }}
            >
              {collaborationAreaT('discussionsCard.viewAll')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default DiscussionsCard;
