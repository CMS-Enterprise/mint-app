import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';

import AutoLinkedText from 'components/AutoLinkedText';
import TextAreaField from 'components/TextAreaField';

const HyperlinkPlayground = () => {
  const { t } = useTranslation('customHome');
  const [playgroundText, setPlaygroundText] = useState('');

  return (
    <SummaryBox
      className="home__hyperlink-playground bg-base-lightest border-base-lighter radius-0 padding-3 margin-bottom-6"
      data-testid="hyperlink-playground"
    >
      <SummaryBoxHeading headingLevel="h2" className="margin-bottom-1">
        {t('hyperlinkPlayground.heading')}
      </SummaryBoxHeading>
      <SummaryBoxContent>
        <p className="margin-top-0 margin-bottom-3">
          {t('hyperlinkPlayground.description')}
        </p>

        <Grid row gap>
          <Grid tablet={{ col: 6 }}>
            <TextAreaField
              id="hyperlink-playground-input"
              name="hyperlinkPlaygroundInput"
              label={t('hyperlinkPlayground.label')}
              hint={t('hyperlinkPlayground.hint')}
              value={playgroundText}
              onChange={event => setPlaygroundText(event.target.value)}
              onBlur={() => {}}
              rows={6}
            />
          </Grid>

          <Grid tablet={{ col: 6 }}>
            <h3 className="font-heading-md margin-top-0 margin-bottom-1">
              {t('hyperlinkPlayground.previewHeading')}
            </h3>
            <div
              className="home__hyperlink-playground-preview border-1px border-base-lighter bg-white padding-2"
              data-testid="hyperlink-playground-preview"
              aria-live="polite"
            >
              {playgroundText ? (
                <AutoLinkedText text={playgroundText} />
              ) : (
                <span className="text-base">
                  {t('hyperlinkPlayground.emptyPreview')}
                </span>
              )}
            </div>
          </Grid>
        </Grid>
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default HyperlinkPlayground;
