import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { CustomTimelineDateType } from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import MINTAlert from 'components/Alert';
import MINTDatePicker from 'components/DatePicker';
import PageHeading from 'components/PageHeading';

import { CustomTimelineDates } from '../..';

const AdditionalModelDates = ({
  customTimelineDates
}: {
  customTimelineDates: CustomTimelineDates;
}) => {
  const { t: timelineMiscT } = useTranslation('timelineMisc');

  return (
    <div>
      <div className="margin-bottom-3">
        <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-1">
          {timelineMiscT('additionalModelDates')}
        </PageHeading>

        <p className="mint-body-normal text-base-darkest margin-top-0 margin-bottom-1">
          {timelineMiscT('additionalModelDatesInfo')}
        </p>

        <span className="mint-body-normal text-base-dark">
          {timelineMiscT('datesFormatsInfo')}
        </span>
      </div>

      {customTimelineDates.length === 0 ? (
        <MINTAlert type="info" slim className="margin-bottom-4">
          {timelineMiscT('noAdditionalModelDates')}
        </MINTAlert>
      ) : (
        <div>
          <ProcessList className="read-only-model-plan__timeline maxw-full margin-left-neg-105">
            {customTimelineDates.map(customDate => {
              const isSingleDate =
                customDate.dateType === CustomTimelineDateType.SINGLE;

              return (
                <ProcessListItem
                  className="read-only-model-plan__timeline__list-item maxw-full"
                  key={customDate.id}
                >
                  <ProcessListHeading
                    type="h5"
                    className="font-body-sm line-height-sans-3 text-bold text-base-darkest"
                  >
                    {customDate.title}
                  </ProcessListHeading>

                  {customDate.description && (
                    <p className="margin-top-0 margin-bottom-1 text-base-dark">
                      {customDate.description}
                    </p>
                  )}

                  <div className="margin-bottom-2">
                    <Button
                      type="button"
                      unstyled
                      className="deep-underline margin-right-2"
                      onClick={() => {}}
                    >
                      {timelineMiscT('editCustomDate')}
                    </Button>

                    <Button
                      type="button"
                      unstyled
                      className="text-error deep-underline"
                      onClick={() => {}}
                    >
                      {timelineMiscT('removeCustomDate')}
                    </Button>
                  </div>

                  <div
                    className={classNames('datepicker__wrapper', {
                      'display-block': isSingleDate
                    })}
                  >
                    <MINTDatePicker
                      className="margin-top-0"
                      fieldName={`customDate-${customDate.id}`}
                      id={`timeline-customDate-${customDate.id}`}
                      label={isSingleDate ? '' : timelineMiscT('startDate')}
                      handleOnBlur={() => {}}
                      formikValue={customDate.startDate}
                      value={customDate.startDate}
                      half={isSingleDate}
                      boldLabel={false}
                    />

                    {!isSingleDate && (
                      <MINTDatePicker
                        className="margin-top-0"
                        fieldName={`customDate-${customDate.id}-end`}
                        id={`timeline-customDate-${customDate.id}-end`}
                        label={timelineMiscT('endDate')}
                        handleOnBlur={() => {}}
                        formikValue={customDate.endDate}
                        value={customDate.endDate}
                        boldLabel={false}
                      />
                    )}
                  </div>
                </ProcessListItem>
              );
            })}
          </ProcessList>
        </div>
      )}

      <AddNote
        id="ModelType-customNote"
        field="customNote"
        className="margin-y-0"
      />
    </div>
  );
};

export default AdditionalModelDates;
