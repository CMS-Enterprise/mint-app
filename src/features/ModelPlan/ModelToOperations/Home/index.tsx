import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Header, PrimaryNav, Select } from '@trussworks/react-uswds';
import classNames from 'classnames';

import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import MTOTable from '../_components/Table';

export type MTOOption = 'milestones' | 'systems-and-solutions';

export const mtoOptions: MTOOption[] = ['milestones', 'systems-and-solutions'];

const MTOHome = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const history = useHistory();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const viewparam = params.get('view');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const [currentView, setCurrentView] = useState<MTOOption>('milestones');

  useEffect(() => {
    if (viewparam && mtoOptions.includes(viewparam as MTOOption)) {
      setCurrentView(viewparam as MTOOption);
    }
  }, [viewparam]);

  return (
    <div className="model-to-operations margin-top-6">
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
