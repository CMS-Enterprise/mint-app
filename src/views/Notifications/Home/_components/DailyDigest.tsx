import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';
import {
  GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits as AnalyzedAuditsTypes,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes as ChangeTypes
} from 'gql/gen/types/GetNotifications';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

import { TranslateStatusChange } from './_utils';

const DailyDigest = ({
  analyzedAudits
}: {
  analyzedAudits: AnalyzedAuditsTypes[];
}) => {
  const { t: notificationsT } = useTranslation('notifications');

  const translatePlanSections = (section: string) => {
    switch (section) {
      case 'plan_basics':
        return notificationsT('index.dailyDigest.planSections.plan_basics');
      case 'plan_payments':
        return notificationsT('index.dailyDigest.planSections.plan_payments');
      case 'plan_ops_eval_and_learning':
        return notificationsT(
          'index.dailyDigest.planSections.plan_ops_eval_and_learning'
        );
      case 'plan_participants_and_providers':
        return notificationsT(
          'index.dailyDigest.planSections.plan_participants_and_providers'
        );
      case 'plan_beneficiaries':
        return notificationsT(
          'index.dailyDigest.planSections.plan_beneficiaries'
        );
      case 'plan_general_characteristics':
        return notificationsT(
          'index.dailyDigest.planSections.plan_general_characteristics'
        );
      default:
        return '';
    }
  };

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
          const changesArray: any = [];

          const pushValuesToChangesArray = (obj: ChangeTypes) => {
            Object.entries(obj).forEach(([key, value]) => {
              if (key !== '__typename') {
                if (Array.isArray(value) && value.length > 0) {
                  if (key === 'added') {
                    changesArray.unshift(key);
                  } else {
                    changesArray.push(key);
                  }
                } else if (typeof value === 'string' && value.trim() !== '') {
                  changesArray.push(key);
                } else if (typeof value === 'number') {
                  changesArray.push(key);
                } else if (typeof value === 'boolean' && value) {
                  changesArray.push(key);
                } else if (value !== null && typeof value === 'object') {
                  if (key === 'crTdls' || key === 'planDiscussions') {
                    changesArray.push(key);
                  } else {
                    pushValuesToChangesArray(value);
                  }
                }
              }
            });
          };

          pushValuesToChangesArray(changes);

          const showFirstFiveChanges = changesArray.slice(0, 5);

          return (
            <div key={modelPlanID} className="margin-bottom-4">
              <PageHeading
                headingLevel="h3"
                className="margin-top-0 margin-bottom-1"
              >
                {modelName}
              </PageHeading>
              <ul className="padding-left-205">
                {modelPlan &&
                  modelPlan.oldName &&
                  showFirstFiveChanges.includes('oldName') && (
                    <li className="line-height-sans-5">
                      {notificationsT('index.dailyDigest.nameChange', {
                        oldName: modelPlan.oldName
                      })}
                    </li>
                  )}
                {modelLeads &&
                  modelLeads.added.length > 0 &&
                  showFirstFiveChanges.includes('added') &&
                  modelLeads.added.map(name => {
                    return (
                      <li key={name.commonName} className="line-height-sans-5">
                        {notificationsT('index.dailyDigest.addModelLead', {
                          name: name.commonName
                        })}
                      </li>
                    );
                  })}
                {documents &&
                  documents.count &&
                  showFirstFiveChanges.includes('count') && (
                    <li className="line-height-sans-5">
                      {notificationsT('index.dailyDigest.documentsAdded', {
                        number: documents.count
                      })}
                    </li>
                  )}
                {crTdls &&
                  crTdls.activity &&
                  showFirstFiveChanges.includes('crTdls') && (
                    <li className="line-height-sans-5">
                      {notificationsT('index.dailyDigest.crTdlsUpdate')}
                    </li>
                  )}
                {planDiscussions &&
                  planDiscussions.activity &&
                  showFirstFiveChanges.includes('planDiscussions') && (
                    <li className="line-height-sans-5">
                      {notificationsT('index.dailyDigest.discussionActivity')}
                    </li>
                  )}
                {planSections &&
                  planSections.readyForReview.length > 0 &&
                  showFirstFiveChanges.includes('readyForReview') && (
                    <li className="line-height-sans-5">
                      {notificationsT('index.dailyDigest.readyForReview', {
                        taskSection: planSections.readyForReview
                          .map(translatePlanSections)
                          .join(', ')
                      })}
                    </li>
                  )}
                {planSections &&
                  planSections.readyForClearance.length > 0 &&
                  showFirstFiveChanges.includes('readyForClearance') && (
                    <li className="line-height-sans-5">
                      {notificationsT('index.dailyDigest.readyForClearance', {
                        taskSection: planSections.readyForClearance
                          .map(translatePlanSections)
                          .join(', ')
                      })}
                    </li>
                  )}
                {planSections &&
                  planSections.updated.length > 0 &&
                  showFirstFiveChanges.includes('updated') && (
                    <li className="line-height-sans-5">
                      {notificationsT('index.dailyDigest.updatesTo', {
                        taskSection: planSections.updated
                          .map(translatePlanSections)
                          .join(', ')
                      })}
                    </li>
                  )}
                {showFirstFiveChanges.includes('statusChanges') &&
                  modelPlan?.statusChanges?.map(status => {
                    return (
                      <li key={status} className="line-height-sans-5">
                        <TranslateStatusChange status={status} />
                      </li>
                    );
                  })}
                {changesArray.length > 5 && (
                  <li className="line-height-sans-5">
                    {notificationsT('index.dailyDigest.moreChanges', {
                      num: changesArray.length - 5
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
