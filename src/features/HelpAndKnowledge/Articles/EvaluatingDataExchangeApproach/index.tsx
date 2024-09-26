import React, { useContext, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import {
  Button,
  Grid,
  GridContainer,
  Icon,
  Table as TrussTable
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';

import Alert from 'components/Alert';
import ExternalLink from 'components/ExternalLink';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PrintPDFWrapper, { PrintPDFContext } from 'contexts/PrintPDFContext';
import { tArray } from 'utils/translation';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import { ArticleCategories, covertToLowercaseAndDashes, HelpArticle } from '..';

export const EvaluatingDataExchangeApproach = () => {
  const { t } = useTranslation('evaluatingDataExchangeApproach');

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
                className="margin-top-4 margin-bottom-5"
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

              <DataExchangeApproachTable />

              <p className="text-bold margin-bottom-0">
                {t('additionalConsiderations')}
              </p>

              <p className="border-bottom padding-bottom-2 margin-bottom-0 margin-top-0">
                {t('additionalConsiderationsDescription')}
              </p>
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

type RowType = {
  id: string;
  category: {
    header: string;
    description: string;
  };
  additionalDetails: {
    header: string;
    list: (string | Record<string, string>)[];
  };
};

const DataExchangeApproachTable = () => {
  const headers = tArray('evaluatingDataExchangeApproach:table.headers');

  const rows = tArray<RowType>('evaluatingDataExchangeApproach:table.rows');

  return (
    <TrussTable
      bordered={false}
      fullWidth
      fixed
      className="fixed-table"
      scrollable
    >
      <thead>
        <tr className="border-bottom-1px">
          {headers.map((k, kIndex) => (
            <th
              key={k}
              scope="col"
              className="padding-y-1"
              style={{
                maxWidth: '250px',
                width: '250px',
                whiteSpace: 'pre-line'
              }}
            >
              <strong>{k}</strong>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row: RowType, rowIndex) => {
          return (
            <tr key={covertToLowercaseAndDashes(row.id)}>
              <td
                className="text-baseline padding-y-2"
                style={{
                  maxWidth: '250px',
                  width: '250px',
                  whiteSpace: 'pre-line'
                }}
              >
                <p className="text-bold margin-0">{row.category.header}</p>

                <span>{row.category.description}</span>
              </td>

              <td
                className="text-baseline padding-y-2"
                style={{
                  maxWidth: '250px',
                  width: '250px',
                  whiteSpace: 'pre-line'
                }}
              >
                <span>{row.additionalDetails.header}</span>

                <ul className="margin-0">
                  {row.additionalDetails.list.map((item, index) => {
                    if (typeof item === 'string') {
                      return <li key={item}>{item}</li>;
                    }
                    return (
                      <li key={item.text}>
                        <div className="flex-container margin-bottom-05">
                          <Trans
                            i18nKey={`evaluatingDataExchangeApproach:table.rows.${rowIndex}.additionalDetails.list.${index}.text`}
                            components={{
                              inlineText: <span />,
                              link1: (
                                <ExternalLink href={item.link}> </ExternalLink>
                              )
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </td>
            </tr>
          );
        })}
      </tbody>
    </TrussTable>
  );
};
export default EvaluatingDataExchangeApproach;
