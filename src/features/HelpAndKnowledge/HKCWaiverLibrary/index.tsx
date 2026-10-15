import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import NotFound from 'features/NotFound';
import {
  GetAllCommonWaiversQuery,
  useGetAllCommonWaiversQuery
} from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import { sortByName } from 'utils/formUtil';

import WaiverCardGroup from './_components/WaivercardGroup';

export type CommonWaiverData =
  GetAllCommonWaiversQuery['commonWaivers'][number];

const HKCWaiverLibrary = () => {
  const { t: waiverLibraryMiscT } = useTranslation('waiverLibraryMisc');

  const {
    data: allCommonWaivers,
    loading,
    error
  } = useGetAllCommonWaiversQuery();

  const sortedWaivers = useMemo(() => {
    if (!allCommonWaivers?.commonWaivers) return [];

    return [...allCommonWaivers.commonWaivers].sort(sortByName);
  }, [allCommonWaivers]);

  if (error) {
    return <NotFound />;
  }

  return (
    <GridContainer>
      <Breadcrumbs
        items={[BreadcrumbItemOptions.HELP_CENTER]}
        customItem={waiverLibraryMiscT('hkcHeading')}
      />

      <h1 className="margin-bottom-1 margin-top-4 line-height-large">
        {waiverLibraryMiscT('hkcHeading')}
      </h1>

      <p className="mint-body-large margin-bottom-2 margin-top-0">
        {waiverLibraryMiscT('description')}
      </p>

      <div className="margin-bottom-6">
        <UswdsReactLink
          to="/help-and-knowledge"
          data-testid="return-to-hkc"
          className="deep-underline"
        >
          <span>
            <Icon.ArrowBack
              className="top-3px margin-right-1"
              aria-label="back"
            />
            {waiverLibraryMiscT('returnToHkc')}
          </span>
        </UswdsReactLink>
      </div>

      {loading ? (
        <PageLoading />
      ) : (
        <WaiverCardGroup commonWaivers={sortedWaivers} />
      )}
    </GridContainer>
  );
};

export default HKCWaiverLibrary;
