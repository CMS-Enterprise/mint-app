import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { GetCollaborationAreaQuery } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';

import '../cards.scss';

export type DataExchangeApproachType =
  GetCollaborationAreaQuery['modelPlan']['dataExchangeApproach'];

// export type iddocQuestionnaireType =
//   GetCollaborationAreaQuery['modelPlan']['iddocQuestionnaire'];

export type AdditionalQuestionnairesCardType = {
  modelID: string;
  dataExhangeApproachData: DataExchangeApproachType;
  // iddocQuestionnaireData: iddocQuestionnaireType;
};

const AdditionalQuestionnairesCard = ({
  modelID,
  dataExhangeApproachData
  // iddocQuestionnaireData
}: AdditionalQuestionnairesCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const navigate = useNavigate();

  return (
    <>
      <Card
        gridLayout={{ desktop: { col: 6 } }}
        className="collaboration-area__card collaboration-area__main-card"
      >
        <CardHeader>
          <h3 className="usa-card__heading">
            {collaborationAreaT('additionalQuestionnairesCard.heading')}
          </h3>
        </CardHeader>

        <CardBody>
          <h4 className="text-bold margin-top-0 margin-bottom-2 line-height-body-2">
            {collaborationAreaT(
              'additionalQuestionnairesCard.requiredQuestionnairesCount',
              { count: 1 }
            )}
          </h4>

          {/* questionnaires status */}
          <div className="margin-bottom-1">
            <div className="display-flex flex-align-center margin-bottom-1">
              <div
                className={classNames(
                  'padding-y-02 padding-x-105 radius-pill margin-right-2',
                  {
                    'collaboration-area__status-complete':
                      dataExhangeApproachData.status === 'COMPLETE',
                    'collaboration-area__status-in-progress':
                      dataExhangeApproachData.status === 'IN_PROGRESS',
                    'collaboration-area__status-not-started':
                      dataExhangeApproachData.status === 'READY'
                  }
                )}
              >
                {additionalQuestionnairesT(
                  `questionnaireStatus.${dataExhangeApproachData.status}`
                )}
              </div>
              <p className="margin-y-0">
                {additionalQuestionnairesT(
                  'questionnairesList.dataExchangeApproach.heading'
                )}
              </p>
            </div>

            <div className="display-flex flex-align-center margin-bottom-1">
              <div className="collaboration-area__status-not-started padding-y-02 padding-x-105 radius-pill margin-right-2">
                {additionalQuestionnairesT(
                  `questionnaireStatus.${dataExhangeApproachData.status}`
                )}
              </div>
              <p className="margin-y-0">
                {additionalQuestionnairesT(
                  'questionnairesList.iddocQuestionnaire.heading'
                )}
              </p>
            </div>
          </div>

          <UswdsReactLink
            to={`/models/${modelID}/collaboration-area/additional-questionnaires`}
            data-testid="view-all-required-questionnaires"
            className="deep-underline"
          >
            {collaborationAreaT('additionalQuestionnairesCard.viewAllRequired')}
            <Icon.ArrowForward
              className="top-3px margin-left-05"
              aria-label="forward"
            />
          </UswdsReactLink>

          <div>
            <h4 className="display-inline-block text-bold margin-top-3 margin-bottom-2 margin-right-2 line-height-body-2">
              {collaborationAreaT(
                'additionalQuestionnairesCard.otherQuestionnairesCount',
                { count: 1 }
              )}
            </h4>

            <UswdsReactLink
              to={`/models/${modelID}/collaboration-area/additional-questionnaires`}
              data-testid="view-data-exchange-help-article"
              className="deep-underline"
            >
              {collaborationAreaT(
                'additionalQuestionnairesCard.viewAllQuestionnaires'
              )}
              <Icon.ArrowForward
                className="top-3px margin-left-05"
                aria-label="forward"
              />
            </UswdsReactLink>
          </div>
        </CardBody>

        <CardFooter>
          <Button
            type="button"
            className="margin-right-2"
            onClick={() =>
              navigate(
                `/models/${modelID}/collaboration-area/additional-questionnaires`
              )
            }
            data-testid="to-data-exchange-approach"
          >
            {collaborationAreaT(
              'additionalQuestionnairesCard.goToQuestionnaires'
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default AdditionalQuestionnairesCard;
