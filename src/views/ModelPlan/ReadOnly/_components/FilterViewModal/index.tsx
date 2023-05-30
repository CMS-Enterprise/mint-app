import React from 'react';
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

  const groupOptions = [
    { value: 'test', label: 'test' },
    { value: 'Gary', label: 'Gary' }
  ];

  return (
    <>
      <div className="filter-view__body padding-top-3 padding-bottom-4">
        <h3 className="margin-y-0">{t('group')}</h3>
        <p className="margin-top-0 margin-bottom-3 font-body-sm text-base">
          {t('content')}
        </p>
        <Form
          className="maxw-none margin-bottom-5"
          onSubmit={() => console.log('asdf')}
        >
          <Label htmlFor="filter-group" className="margin-y-0 text-normal">
            {t('selectAGroup')}
          </Label>
          <ComboBox
            id="filter-group"
            name="filter-group"
            onChange={() => console.log('asdf')}
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
          <Button type="button" disabled className="margin-x-0">
            {t('viewFiltered')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterViewModal;
