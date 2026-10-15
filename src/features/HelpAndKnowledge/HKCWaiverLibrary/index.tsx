import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, Icon } from '@trussworks/react-uswds';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';

const HKCWaiverLibrary = () => {
  const { t: waiverLibraryMiscT } = useTranslation('waiverLibraryMisc');

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
    </GridContainer>
  );
};

export default HKCWaiverLibrary;
