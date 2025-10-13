import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, Icon, PrimaryNav, Select } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  ComponentGroup,
  useGetModelPlansByComponentGroupQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import ModelsCardTable from '../ModelCardTable';

const ModelsByGroup = ({
  componentGroupKeys
}: {
  componentGroupKeys: ComponentGroup[];
}) => {
  const { t: customHomeT } = useTranslation('customHome');
  const { t: homepageSettingsT } = useTranslation('homepageSettings');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const orderedComponentGroupKeys = useMemo(() => {
    return [...componentGroupKeys].sort((a, b) => a.localeCompare(b));
  }, [componentGroupKeys]);

  const [isCurrentComponentGroup, setIsCurrentComponentGroup] =
    useState<ComponentGroup>(orderedComponentGroupKeys[0]);

  const { data } = useGetModelPlansByComponentGroupQuery({
    variables: {
      key: isCurrentComponentGroup
    },
    skip: !isCurrentComponentGroup
  });

  const modelsByGroup =
    data?.modelPlansByComponentGroup?.map(item => item.modelPlan) || [];

  const componentGroupNavs = orderedComponentGroupKeys.map(
    componentGroupKey => (
      <button
        type="button"
        key={componentGroupKey}
        onClick={() => setIsCurrentComponentGroup(componentGroupKey)}
        className={classNames(
          'usa-nav__link margin-left-neg-2 margin-right-2',
          {
            'usa-current': isCurrentComponentGroup === componentGroupKey
          }
        )}
      >
        <span>
          {homepageSettingsT(`componentGroupAcronyms.${componentGroupKey}`)}
        </span>
      </button>
    )
  );

  if (componentGroupKeys.length === 0) {
    return (
      <Alert
        type="info"
        className="margin-top-4"
        heading={customHomeT(`settings.MODELS_BY_GROUP.noResultsHeading`)}
      >
        <UswdsReactLink
          to="/homepage-settings/groups"
          state={{ fromHome: true }}
          className="display-flex flex-align-center text-bold"
        >
          <span className="margin-right-1">
            {customHomeT(`settings.MODELS_BY_GROUP.noResultsDescription`)}
          </span>
          <Icon.ArrowForward aria-label="forward" />
        </UswdsReactLink>
      </Alert>
    );
  }

  return (
    <div className="models-by-solutions">
      {componentGroupKeys.length < 6 && (
        <Header
          basic
          extended={false}
          className="margin-bottom-4 models-by-solutions__nav-container"
        >
          <div className="usa-nav-container padding-0">
            <PrimaryNav
              items={componentGroupNavs}
              mobileExpanded={false}
              className="flex-justify-start margin-0 padding-0"
            />
          </div>
        </Header>
      )}

      {(isTablet || componentGroupKeys.length > 5) && (
        <div className="maxw-mobile-lg">
          <Select
            id="solutionKey"
            name="solutionKey"
            value={isCurrentComponentGroup}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setIsCurrentComponentGroup(
                e.currentTarget.value as ComponentGroup
              )
            }
            className="margin-bottom-4 text-primary text-bold"
          >
            {orderedComponentGroupKeys.map(componentGroup => {
              return (
                <option key={componentGroup} value={componentGroup}>
                  {componentGroup}
                </option>
              );
            })}
          </Select>
        </div>
      )}

      <ModelsCardTable
        models={modelsByGroup}
        filterKey={isCurrentComponentGroup}
        type="group"
      />
    </div>
  );
};

export default ModelsByGroup;
