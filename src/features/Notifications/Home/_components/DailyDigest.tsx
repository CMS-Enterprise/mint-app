import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';
import { AnalyzedAudit as AnalyzedAuditsTypes } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

import { pushValuesToChangesArray } from './_utils';

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
          changes,
          changes: {
            modelPlan,
            documents,
            crTdls,
            planSections,
            modelLeads,
            planDiscussions
          }
        }) => {
          const allTheChanges: string[] = pushValuesToChangesArray(changes);
          const firstFiveChanges = allTheChanges.slice(0, 5);

          return (
            <div key={modelPlanID} className="margin-bottom-4">
              <PageHeading
                headingLevel="h3"
                className="margin-top-0 margin-bottom-1"
              >
                {modelName}
              </PageHeading>
              <ul className="padding-left-205">
                {modelPlan?.oldName && firstFiveChanges.includes('oldName') && (
                  <li className="line-height-sans-5">
                    {notificationsT('index.dailyDigest.nameChange', {
                      oldName: modelPlan.oldName
                    })}
                  </li>
                )}
                {modelLeads?.added &&
                  modelLeads.added.length > 0 &&
                  firstFiveChanges.includes('added') &&
                  modelLeads?.added.map(name => {
                    return (
                      <li key={name.commonName} className="line-height-sans-5">
                        {notificationsT('index.dailyDigest.addModelLead', {
                          name: name.commonName
                        })}
                      </li>
                    );
                  })}
                {documents?.count && firstFiveChanges.includes('count') && (
                  <li className="line-height-sans-5">
                    {notificationsT('index.dailyDigest.documentsAdded', {
                      number: documents.count
                    })}
                  </li>
                )}
                {crTdls?.activity && firstFiveChanges.includes('crTdls') && (
                  <li className="line-height-sans-5">
                    {notificationsT('index.dailyDigest.crTdlsUpdate')}
                  </li>
                )}
                {planDiscussions?.activity &&
                  firstFiveChanges.includes('planDiscussions') && (
                    <li className="line-height-sans-5">
                      {notificationsT('index.dailyDigest.discussionActivity')}
                    </li>
                  )}
                {planSections?.readyForReview &&
                  planSections.readyForReview.length > 0 &&
                  firstFiveChanges.includes('readyForReview') && (
                    <li className="line-height-sans-5">
                      {notificationsT('index.dailyDigest.readyForReview', {
                        taskSection: planSections.readyForReview
                          .map(section =>
                            notificationsT(
                              `index.dailyDigest.planSections.${section}`
                            )
                          )
                          .join(', ')
                      })}
                    </li>
                  )}
                {planSections?.readyForClearance &&
                  planSections.readyForClearance.length > 0 &&
                  firstFiveChanges.includes('readyForClearance') && (
                    <li className="line-height-sans-5">
                      {notificationsT('index.dailyDigest.readyForClearance', {
                        taskSection: planSections.readyForClearance
                          .map(section =>
                            notificationsT(
                              `index.dailyDigest.planSections.${section}`
                            )
                          )
                          .join(', ')
                      })}
                    </li>
                  )}
                {planSections?.updated &&
                  planSections.updated.length > 0 &&
                  firstFiveChanges.includes('updated') && (
                    <li className="line-height-sans-5">
                      {notificationsT('index.dailyDigest.updatesTo', {
                        taskSection: planSections.updated
                          .map(section =>
                            notificationsT(
                              `index.dailyDigest.planSections.${section}`
                            )
                          )
                          .join(', ')
                      })}
                    </li>
                  )}
                {planSections?.dataExchangeApproachMarkedComplete && (
                  <li className="line-height-sans-5">
                    {notificationsT(
                      'index.dailyDigest.dataExchangeApproachComplete'
                    )}
                  </li>
                )}
                {modelPlan?.statusChanges &&
                  firstFiveChanges.includes('statusChanges') && (
                    <li className="line-height-sans-5">
                      {notificationsT(
                        `index.dailyDigest.statusChange.${modelPlan.statusChanges[0]}`
                      )}
                    </li>
                  )}
                {allTheChanges.length > 5 && (
                  <li className="line-height-sans-5">
                    {notificationsT('index.dailyDigest.moreChanges', {
                      num: allTheChanges.length - 5
                    })}
                  </li>
                )}
              </ul>
              <UswdsReactLink
                to={`/models/${modelPlanID}/change-history`}
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
