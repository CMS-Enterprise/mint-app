import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Header, PrimaryNav, Select } from '@trussworks/react-uswds';
import classNames from 'classnames';

import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import MTOModal from '../_components/Modal';
import MTOTable from '../_components/Table';

export type MTOOption = 'milestones' | 'systems-and-solutions';

export const mtoOptions: MTOOption[] = ['milestones', 'systems-and-solutions'];

const MTOHome = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const history = useHistory();

  const location = useLocation();

  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const viewparam = params.get('view');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const [currentView, setCurrentView] = useState<MTOOption>('milestones');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (viewparam && mtoOptions.includes(viewparam as MTOOption)) {
      setCurrentView(viewparam as MTOOption);
    } else {
      // Default to milestones if no view param present
      params.set('view', 'milestones');
      history.push({ search: params.toString() });
    }
  }, [viewparam, history, params]);

  return (
    <div className="model-to-operations margin-y-6">
      {/* TEMPORARY since WIP components are not finalized */}
      <MTOModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
      <div className="width-fit-content">
        <div
          style={{ paddingTop: '2px', paddingBottom: '2px' }}
          className={classNames(
            'display-flex flex-justify bg-base-lightest padding-x-3 text-white radius-top-lg bg-secondary-dark'
          )}
        >
          TEMPORARY
        </div>
        <Button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="margin-bottom-4"
        >
          Add custom category
        </Button>
      </div>
      {/* TEMPORARY since WIP components are not finalized */}

      <Header
        basic
        extended={false}
        className="margin-bottom-4 model-to-operations__nav-container"
      >
        <div className="usa-nav-container padding-0">
          <PrimaryNav
            items={mtoOptions.map(item => (
              <button
                type="button"
                onClick={() => {
                  params.set('view', item);
                  history.push({ search: params.toString() });
                }}
                className={classNames(
                  'usa-nav__link margin-left-neg-2 margin-right-2',
                  {
                    'usa-current': currentView === item
                  }
                )}
              >
                <span
                  className={classNames({
                    'text-primary': currentView === item
                  })}
                >
                  {t(item)}
                </span>
              </button>
            ))}
            mobileExpanded={false}
            className="flex-justify-start margin-0 padding-0"
          />
        </div>
      </Header>

      {isTablet && (
        <div className="maxw-mobile-lg">
          <Select
            id="mto-navigation-select"
            name="currentView"
            value={currentView}
            onChange={e => {
              params.set('view', e.target.value);
              history.push({ search: params.toString() });
            }}
            className="margin-bottom-4 text-primary text-bold"
          >
            {mtoOptions.map(item => {
              return (
                <option key={item} value={item}>
                  {t(item)}
                </option>
              );
            })}
          </Select>
        </div>
      )}

      {currentView === 'milestones' && <MTOTable />}
    </div>
  );
};

export default MTOHome;
