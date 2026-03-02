import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, SummaryBox, SummaryBoxContent } from '@trussworks/react-uswds';
import classNames from 'classnames';

const IDDOCBanner = () => {
  const { t: iddocQuestionnaireMiscT } = useTranslation(
    'iddocQuestionnaireMisc'
  );

  return (
    <SummaryBox className={classNames('padding-x-0 padding-y-1 border-0')}>
      <SummaryBoxContent>
        <div className="display-flex">
          <Icon.Info
            size={3}
            className="minw-3 margin-right-2"
            aria-label="info"
          />
          <p className="padding-y-0 margin-0">
            {iddocQuestionnaireMiscT('bannerText')}
          </p>
        </div>
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default IDDOCBanner;
