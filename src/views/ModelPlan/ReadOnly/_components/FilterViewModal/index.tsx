import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  ComboBox,
  Form,
  Label,
  Link
} from '@trussworks/react-uswds';

type FilterViewModalProps = {
  closeModal: () => void;
};

const FilterViewModal = ({ closeModal }: FilterViewModalProps) => {
  const { t } = useTranslation('filterView');

  const [filteredGroup, setFilteredGroup] = useState('');

  const groupOptions = [
    { value: 'ccw', label: 'Chronic Conditions Warehouse (CCW)' },
    { value: 'cmmi', label: 'CMMI Cost Estimate' },
    {
      value: 'cbosc',
      label: 'Consolidated Business Operations Support Center (CBOSC)'
    },
    {
      value: 'dfsdm',
      label: 'Division of Financial Services and Debt Management (DFSDM)'
    },
    { value: 'ipc', label: 'Innovation Payment Contractor (IPC)' },
    {
      value: 'iddoc',
      label: 'Innovative Design, Development, and Operations Contract (IDDOC)'
    },
    { value: 'mdm', label: 'Master Data Management (MDM)' },
    { value: 'oact', label: 'Office of the Actuary (OACT)' },
    { value: 'pbg', label: 'Provider Billing Group (PBG)' }
  ];

  return (
    <>
      <div className="filter-view__body padding-top-3 padding-bottom-4">
        <h3 className="margin-y-0">{t('group')}</h3>
        <p className="margin-top-0 margin-bottom-3 font-body-sm text-base">
          {t('content')}
        </p>
        <Form className="maxw-none margin-bottom-5" onSubmit={() => {}}>
          <Label htmlFor="filter-group" className="margin-y-0 text-normal">
            {t('selectAGroup')}
          </Label>
          <ComboBox
            id="filter-group"
            name="filter-group"
            onChange={value => {
              if (value !== '' && value !== undefined) {
                setFilteredGroup(value);
              }
              if (value === undefined) {
                setFilteredGroup('');
              }
            }}
            options={groupOptions}
          />
        </Form>

        <Alert noIcon type="info">
          <p className="margin-y-0 font-body-sm text-bold">
            {t('alert.heading')}
          </p>
          <p className="margin-y-0 font-body-sm">
            <Trans i18nKey="filterView:alert.content">
              indexOne
              <Link href="mailto:MINTTeam@cms.hhs.gov">helpTextEmail</Link>
              indexTwo
            </Trans>
          </p>
        </Alert>
      </div>
      <div className="filter-view__footer margin-x-neg-4 border-top-1px border-base-lighter">
        <div className="padding-x-4 padding-top-2 display-flex flex-justify">
          <Button type="button" unstyled onClick={closeModal}>
            {t('viewAll')}
          </Button>
          <Button
            type="button"
            disabled={filteredGroup === ''}
            className="margin-x-0"
            // onClick={() => console.log(filteredGroup)}
          >
            {t('viewFiltered')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterViewModal;
