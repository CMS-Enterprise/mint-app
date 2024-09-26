import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { Button, Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';

import Alert from 'components/Alert';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PrintPDFWrapper, { PrintPDFContext } from 'contexts/PrintPDFContext';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import { ArticleCategories, HelpArticle } from '..';

export const EvaluatingDataExhangeApproach = () => {
  const { t } = useTranslation('evaluatingDataExhangeApproach');

  // Used for react-to-pdf to render pdf from component ref
  const componentRef = useRef<HTMLDivElement>(null);

  const { setPrintPDF } = useContext(PrintPDFContext);

  // Submit handler for exporting PDF
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: t('heading'),
    onAfterPrint: () => {
      setPrintPDF(false);
    }
  });

  return (
    <PrintPDFWrapper>
      <MainContent className="mint-body-normal">
        <GridContainer>
          <Grid tablet={{ col: 12 }}>
            <HelpBreadcrumb text={t('heading')} />

            <div ref={componentRef} className="padding-bottom-6">
              <PageHeading className="margin-bottom-2">
                {t('heading')}
              </PageHeading>

              <HelpCategoryTag type={ArticleCategories.GETTING_STARTED} />

              <p className="mint-body-large margin-1">{t('description')}</p>

              <Alert
                type="info"
                noIcon
                slim
                className="margin-top-4 margin-bottom-6"
              >
                {t('alert')}
              </Alert>

              <Button
                type="button"
                onClick={handlePrint}
                unstyled
                className="mint-no-print margin-bottom-2"
              >
                <Icon.FileDownload className="margin-right-05" />
                {t('downloadPDF')}
              </Button>
            </div>
          </Grid>
        </GridContainer>
      </MainContent>

      <RelatedArticles
        currentArticle={HelpArticle.MODEL_PLAN_OVERVIEW}
        specificArticles={[
          HelpArticle.TWO_PAGER_MEETING,
          HelpArticle.SIX_PAGER_MEETING,
          HelpArticle.HIGH_LEVEL_PROJECT_PLAN
        ]}
        viewAllLink
      />
    </PrintPDFWrapper>
  );
};

export default EvaluatingDataExhangeApproach;
