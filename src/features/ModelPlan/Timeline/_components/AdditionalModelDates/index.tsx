import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { FieldArray } from 'formik';
import {
  CustomTimelineDateType,
  GetTimelineQuery
} from 'gql/generated/graphql';

import MINTAlert from 'components/Alert';
import MINTDatePicker from 'components/DatePicker';
import { isDateInPast } from 'utils/date';

import RemoveCustomDateModal from '../RemoveCustomDateModal';

export type CustomTimelineDates =
  GetTimelineQuery['modelPlan']['timeline']['customTimelineDates'];

const RemoveCustomDateButton = ({
  customDateID,
  onDeleteSuccess
}: {
  customDateID: string;
  onDeleteSuccess: () => void;
}) => {
  const { t: timelineMiscT } = useTranslation('timelineMisc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <RemoveCustomDateModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        customDateID={customDateID}
        onDeleteSuccess={onDeleteSuccess}
      />

      <Button
        type="button"
        unstyled
        className="text-error deep-underline"
        onClick={() => setIsModalOpen(true)}
      >
        {timelineMiscT('removeCustomDate')}
      </Button>
    </>
  );
};

const AdditionalModelDates = ({
  initialCustomDates,
  customTimelineDates,
  onBlur
}: {
  initialCustomDates: CustomTimelineDates;
  customTimelineDates: CustomTimelineDates;
  onBlur: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}) => {
  const { t: timelineMiscT } = useTranslation('timelineMisc');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const location = useLocation();

  const navigate = useNavigate();

  return (
    <div>
      <div className="margin-bottom-1">
        <h2 className="margin-top-0 margin-bottom-1">
          {timelineMiscT('additionalModelDates')}
        </h2>

        <p className="mint-body-normal text-base-darkest margin-top-0 margin-bottom-1">
          {timelineMiscT('additionalModelDatesInfo')}
        </p>

        <span className="mint-body-normal text-base-dark">
          {timelineMiscT('datesFormatsInfo')}
        </span>
      </div>

      {customTimelineDates.length === 0 ? (
        <MINTAlert type="info" slim className="margin-top-3 margin-bottom-4">
          {timelineMiscT('noAdditionalModelDates')}
        </MINTAlert>
      ) : (
        <div>
          <FieldArray name="customTimelineDates">
            {({ remove }) => (
              <ProcessList className="read-only-model-plan__timeline maxw-full margin-left-neg-105">
                {customTimelineDates.map((customDate, index) => {
                  const isSingleDate =
                    customDate.dateType === CustomTimelineDateType.SINGLE;

                  const initialCustomDate = initialCustomDates.find(
                    initialDate => initialDate.id === customDate.id
                  );

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
                          onClick={() => {
                            navigate(
                              `${location.pathname}/customDate/${customDate.id}`
                            );
                          }}
                        >
                          {timelineMiscT('editCustomDate')}
                        </Button>

                        <RemoveCustomDateButton
                          customDateID={customDate.id}
                          onDeleteSuccess={() => remove(index)}
                        />
                      </div>

                      <div
                        className={classNames('datepicker__wrapper', {
                          'display-block': isSingleDate
                        })}
                      >
                        <MINTDatePicker
                          className="margin-top-0"
                          fieldName={`customTimelineDates[${index}].startDate`}
                          id={`timeline-customDate-${customDate.id}-start`}
                          label={isSingleDate ? '' : timelineMiscT('startDate')}
                          handleOnBlur={onBlur}
                          formikValue={customDate.startDate}
                          value={customDate.startDate}
                          half={isSingleDate}
                          boldLabel={false}
                          warning={false}
                          shouldShowWarning={
                            initialCustomDate?.startDate !==
                            customDate.startDate
                          }
                        />

                        {!isSingleDate && (
                          <MINTDatePicker
                            className="margin-top-0"
                            fieldName={`customTimelineDates[${index}].endDate`}
                            id={`timeline-customDate-${customDate.id}-end`}
                            label={timelineMiscT('endDate')}
                            handleOnBlur={onBlur}
                            formikValue={customDate.endDate}
                            value={customDate.endDate}
                            boldLabel={false}
                            warning={false}
                            shouldShowWarning={
                              initialCustomDate?.endDate !== customDate.endDate
                            }
                          />
                        )}
                      </div>

                      {(isDateInPast(customDate.startDate) ||
                        isDateInPast(customDate.endDate)) &&
                        (initialCustomDate?.startDate !==
                          customDate.startDate ||
                          initialCustomDate?.endDate !==
                            customDate.endDate) && (
                          <Alert
                            type="warning"
                            className="margin-top-4"
                            headingLevel="h4"
                          >
                            {miscellaneousT('dateWarning')}
                          </Alert>
                        )}
                    </ProcessListItem>
                  );
                })}
              </ProcessList>
            )}
          </FieldArray>
        </div>
      )}
    </div>
  );
};

export default AdditionalModelDates;
