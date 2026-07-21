import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import DateTimePicker from 'components/DateTimePicker';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

const DateRangeModal = ({
  isModalOpen,
  closeModal
}: {
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const { t: analyticsT } = useTranslation('analytics');
  const { t: generalT } = useTranslation('general');

  const [startDate, setStartDate] = useState('');

  const [endDate, setEndDate] = useState('');

  const isDownloadDisabled = !startDate || !endDate;

  return (
    <Modal
      isOpen={isModalOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal"
    >
      <div className="padding-bottom-8">
        <div className="margin-bottom-2">
          <PageHeading
            headingLevel="h3"
            className="margin-top-0 margin-bottom-2"
          >
            {analyticsT('dateRange.heading')}
          </PageHeading>

          <p className="text-base-darkest margin-y-0">
            {analyticsT('dateRange.description')}
          </p>
        </div>

        <h4 className="text-base-darkest margin-top-0 margin-bottom-2">
          {analyticsT('dateRange.subHeading')}
        </h4>

        <div className="margin-bottom-2 padding-right-1">
          <div className="margin-bottom-3">
            <label htmlFor="startDate">{generalT('filter.startDate')}</label>

            <p className="margin-0 text-base">{generalT('datePlaceholder')}</p>

            <DateTimePicker
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={date => setStartDate(date ?? '')}
              isClearable
              alertText={false}
              alertIcon={false}
            />
          </div>

          <div>
            <label htmlFor="endDate">{generalT('filter.endDate')}</label>

            <p className="margin-0 text-base">{generalT('datePlaceholder')}</p>

            <DateTimePicker
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={date => setEndDate(date ?? '')}
              endOfDay
              isClearable
              alertText={false}
              alertIcon={false}
            />
          </div>
        </div>

        <div className="margin-top-2 display-flex mint-modal__footer">
          <Button
            type="button"
            className="margin-right-3 margin-top-0"
            disabled={isDownloadDisabled}
            onClick={() => {
              //     console.log('download CTAT report', { startDate, endDate });
              closeModal();
            }}
          >
            {analyticsT('download')}
          </Button>
          <Button
            type="button"
            className="margin-top-0 deep-underline"
            unstyled
            onClick={closeModal}
          >
            {generalT('cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DateRangeModal;
