import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { formatDateUtc } from 'utils/date';

type DatesChangedProps = {
  modelPlan: {
    modelName: string;
  };
  modelPlanID: string;
  dateChanges: {
    field: string;
    isChanged: boolean;
    isRange: boolean;
    newDate?: string | null;
    newRangeStart?: string | null;
    newRangeEnd?: string | null;
    oldDate?: string | null;
    oldRangeStart?: string | null;
    oldRangeEnd?: string | null;
  }[];
};

const DatesChanged = ({
  modelPlan,
  modelPlanID,
  dateChanges
}: DatesChangedProps) => {
  const { t: notificationsT } = useTranslation('notifications');
  const { t: basicsMiscT } = useTranslation('basicsMisc');

  return (
    <Grid
      desktop={{ col: 12 }}
      className="border-1 border-base-lightest padding-x-3 padding-y-5"
      data-testid="notification--dates-changed"
    >
      <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-2">
        {notificationsT('index.datesChanged.heading', {
          modelName: modelPlan?.modelName
        })}
      </PageHeading>
      <p className="margin-top-0 margin-bottom-3">
        {notificationsT('index.datesChanged.subheading')}
      </p>
      <PageHeading headingLevel="h3" className="margin-top-0 margin-bottom-3">
        {basicsMiscT('highLevelTimeline')}
      </PageHeading>

      {dateChanges.map(
        ({
          field,
          isChanged,
          isRange,
          newDate,
          newRangeStart,
          newRangeEnd,
          oldDate,
          oldRangeStart,
          oldRangeEnd
        }) => {
          const dateOrNoDate = (date: string | undefined | null) => {
            return date ? (
              formatDateUtc(date, 'MM/dd/yyyy')
            ) : (
              <span className="text-italic">
                {notificationsT(`index.datesChanged.noDateEntered`)}
              </span>
            );
          };

          return (
            <div>
              <p className="text-bold margin-y-0 line-height-sans-4">
                {notificationsT(`index.datesChanged.field.${field}`)}
              </p>
              <div className="margin-bottom-3">
                {isRange ? (
                  // isRange code here
                  <>
                    <p
                      className={`line-height-sans-4 margin-y-0 ${
                        isChanged ? 'text-error text-strike text-italic' : ''
                      }`}
                    >
                      {dateOrNoDate(oldRangeStart)} -{' '}
                      {dateOrNoDate(oldRangeEnd)}
                    </p>
                    {isChanged && (
                      <p className="line-height-sans-4 margin-y-0">
                        {dateOrNoDate(newRangeStart)}-{' '}
                        {dateOrNoDate(newRangeEnd)}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <span
                      className={`line-height-sans-4 margin-y-0 ${
                        isChanged ? 'text-error text-strike text-italic' : ''
                      }`}
                    >
                      {dateOrNoDate(oldDate)}
                    </span>
                    <span className="line-height-sans-4 margin-y-0">
                      {' '}
                      {isChanged && dateOrNoDate(newDate)}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        }
      )}
      <UswdsReactLink
        to={`/models/${modelPlanID}/read-only`}
        className="text-bold"
      >
        {notificationsT('index.datesChanged.cta')}
      </UswdsReactLink>
    </Grid>
  );
};

export default DatesChanged;
