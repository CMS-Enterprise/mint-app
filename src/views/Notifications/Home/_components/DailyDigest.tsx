import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';
import { GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits as AnalyzedAuditsTypes } from 'gql/gen/types/GetNotifications';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

import { translatePlanSections } from './_utils';

const DailyDigest = ({
  analyzedAudits
}: {
  analyzedAudits: AnalyzedAuditsTypes[];
}) => {
  const { t: notificationsT } = useTranslation('notifications');

  return (
    <Grid
      desktop={{ col: 12 }}
      className="border-1 border-base-lightest padding-x-3 padding-y-5"
      data-testid="notification--daily-digest"
    >
      <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-4">
        {notificationsT('index.dailyDigest.heading')}
      </PageHeading>

      {analyzedAudits.map(
        ({
          modelName,
          modelPlanID,
          changes: {
            modelPlan,
            documents,
            crTdls,
            planSections,
            modelLeads,
            planDiscussions
          }
        }) => {
          return (
            <div key={modelPlanID} className="margin-bottom-4">
              <PageHeading
                headingLevel="h3"
                className="margin-top-0 margin-bottom-1"
              >
                {modelName}
              </PageHeading>
              <ul className="padding-left-205">
                {modelPlan && modelPlan.oldName && (
                  <li className="line-height-sans-5">
                    {notificationsT('index.dailyDigest.nameChange', {
                      oldName: modelPlan.oldName
                    })}
                  </li>
                )}
                {modelLeads &&
                  modelLeads.added.length > 0 &&
                  modelLeads.added.map(name => {
                    return (
                      <li className="line-height-sans-5">
                        {notificationsT('index.dailyDigest.addModelLead', {
                          name: name.commonName
                        })}
                      </li>
                    );
                  })}
                {documents && documents.count && (
                  <li className="line-height-sans-5">
                    {notificationsT('index.dailyDigest.documentsAdded', {
                      number: documents.count
                    })}
                  </li>
                )}
                {crTdls && crTdls.activity && (
                  <li className="line-height-sans-5">
                    {notificationsT('index.dailyDigest.crTdlsUpdate')}
                  </li>
                )}
                {planDiscussions && planDiscussions.activity && (
                  <li className="line-height-sans-5">
                    {notificationsT('index.dailyDigest.discussionActivity')}
                  </li>
                )}
                {planSections && planSections.readyForReview.length > 0 && (
                  <li className="line-height-sans-5">
                    {notificationsT('index.dailyDigest.readyForReview', {
                      taskSection: planSections.readyForReview
                        .map(translatePlanSections)
                        .join(', ')
                    })}
                  </li>
                )}
                {planSections && planSections.readyForClearance.length > 0 && (
                  <li className="line-height-sans-5">
                    {notificationsT('index.dailyDigest.readyForClearance', {
                      taskSection: planSections.readyForClearance
                        .map(translatePlanSections)
                        .join(', ')
                    })}
                  </li>
                )}
                {planSections && planSections.updated.length > 0 && (
                  <li className="line-height-sans-5">
                    {notificationsT('index.dailyDigest.updatesTo', {
                      taskSection: planSections.updated
                        .map(translatePlanSections)
                        .join(', ')
                    })}
                  </li>
                )}
              </ul>
              <UswdsReactLink
                to={`/models/${modelPlanID}/read-only`}
                className="display width-fit-content"
              >
                <div className="display-flex flex-align-center">
                  {notificationsT('index.dailyDigest.cta')}
                  <Icon.ArrowForward className="margin-left-1" aria-hidden />
                </div>
              </UswdsReactLink>
            </div>
          );
        }
      )}

      <div className="border-top-1px border-base-light padding-top-2">
        <p className="margin-y-0">
          {notificationsT('index.dailyDigest.unsubscribe')}
        </p>
      </div>
    </Grid>
  );
};

export default DailyDigest;
