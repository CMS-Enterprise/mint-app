import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Alert,
  Button,
  ComboBox,
  Form,
  Label,
  Link
} from '@trussworks/react-uswds';

import { groupOptions } from '../util';

type FilterViewModalProps = {
  filteredView: string | null | undefined;
  closeModal: () => void;
};

const FilterViewModal = ({
  filteredView,
  closeModal
}: FilterViewModalProps) => {
  const { t } = useTranslation('filterView');
  const history = useHistory();

  const [filteredGroup, setFilteredGroup] = useState('');

  const handleSubmit = (value: string) => {
    // timeout hack to get scroll to work here
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    const { pathname } = history.location;

    if (value === 'view-all') {
      history.push(pathname);
    } else {
      history.push(`${pathname}?filter-view=${value}`);
    }

    closeModal();
  };

  return (
    <div data-testid="filter-view-modal">
      <div className="filter-view__body padding-top-3 padding-bottom-4">
        <h3 className="margin-y-0">{t('modalTitle')}</h3>
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
            defaultValue={filteredView || ''}
            options={groupOptions}
          />
        </Form>

        <Alert noIcon type="info" headingLevel="h4">
          <span className="margin-y-0 font-body-sm text-bold display-block">
            {t('alert.heading')}
          </span>
          <Trans i18nKey="filterView:alert.content">
            indexOne
            <Link href="mailto:MINTTeam@cms.hhs.gov">helpTextEmail</Link>
            indexTwo
          </Trans>
        </Alert>
      </div>
      <div className="filter-view__footer margin-x-neg-4 border-top-1px border-base-lighter">
        <div className="padding-x-4 padding-top-2 display-flex flex-justify">
          <Button
            type="button"
            unstyled
            onClick={() => handleSubmit('view-all')}
          >
            {t('viewAll')}
          </Button>
          <Button
            type="button"
            data-testid="filter-view-submit"
            disabled={filteredGroup === ''}
            className="margin-x-0"
            onClick={() => handleSubmit(filteredGroup)}
          >
            {t('viewFiltered')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterViewModal;
