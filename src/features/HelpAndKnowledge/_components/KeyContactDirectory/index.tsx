import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Accordion,
  Button,
  Grid,
  GridContainer,
  Link
} from '@trussworks/react-uswds';
import { AccordionItemProps } from '@trussworks/react-uswds/lib/components/Accordion/Accordion';
import {
  GetAllKeyContactsQuery,
  useGetAllKeyContactsQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';
import { isAssessment } from 'utils/user';

import KeyContactTable from './_components/KeyContactTable';
import SmeModal, { smeModeType } from './_components/SmeModal';

import './index.scss';

const Categories = [
  {
    __typename: 'KeyContactCategory',
    id: 'a95a1f98-fb7a-43f9-9e3c-abc52238e350',
    category: 'Healthcare'
  },
  {
    __typename: 'KeyContactCategory',
    id: 'a95a1f98-fb7a-43f9-9e3c-abc52238e351',
    category: 'CMS Programs'
  }
];

export type SmeType = GetAllKeyContactsQuery['keyContacts'][number];

const KeyContactDirectory = () => {
  const { t } = useTranslation('helpAndKnowledge');

  // Used to check if user is assessment for rendering different content and access
  const { groups } = useSelector((state: AppState) => state.auth);
  const flags = useFlags();

  const [query, setQuery] = useState('');
  const [isSmeModalOpen, setIsSmeModalOpen] = useState(false);
  const [smeModalMode, setSmeModalMode] = useState<smeModeType | null>(null);

  const isAssessmentTeam = isAssessment(groups, flags);

  const categories = Categories; // Replace with actual data fetching logic

  const { data: smeData, loading: loadingSmes } = useGetAllKeyContactsQuery();

  const filteredSmes = useMemo(() => {
    if (!smeData) {
      return [];
    }
    const trimmedQuery = query.toLowerCase().trim();
    let smeContacts = smeData.keyContacts;

    if (trimmedQuery !== '') {
      const filteredCategoryIds = Categories.filter(category =>
        category.category.toLowerCase().includes(trimmedQuery)
      ).map(cat => cat.id);

      smeContacts = smeData.keyContacts.filter(sme => {
        return (
          filteredCategoryIds.includes(sme.subjectCategoryID) ||
          sme.name.toLowerCase().includes(trimmedQuery) ||
          sme.email.toLowerCase().includes(trimmedQuery) ||
          sme.subjectArea.toLowerCase().includes(trimmedQuery)
        );
      });
    }

    return smeContacts;
  }, [query, smeData]);

  const reformattedSmes = useMemo(() => {
    return filteredSmes.reduce<Record<string, SmeType[]>>((allSmes, sme) => {
      return {
        ...allSmes,
        [sme.subjectCategoryID]: allSmes[sme.subjectCategoryID]
          ? [...allSmes[sme.subjectCategoryID], sme]
          : [sme]
      };
    }, {});
  }, [filteredSmes]);

  const accordionItems: AccordionItemProps[] = categories.map(category => ({
    title: category.category,
    content: (
      <>
        {smeModalMode && (
          <SmeModal
            isOpen={isSmeModalOpen}
            mode={smeModalMode}
            closeModal={() => setIsSmeModalOpen(false)}
            categoryId={
              smeModalMode === 'addWithCategory' ? category.id : undefined
            }
          />
        )}

        {isAssessmentTeam && (
          <div className="margin-top-2">
            <Button
              type="button"
              unstyled
              onClick={() => {
                setIsSmeModalOpen(true);
                setSmeModalMode('addWithCategory');
              }}
              className="line-height-sans-4 deep-underline padding-0"
            >
              {t('keyContactDirectory.addSmeToCategory')}
            </Button>
            <div className="display-inline height-full width-1px border-left border-width-1px border-base-light margin-x-2" />
            <Button
              type="button"
              unstyled
              onClick={() => {}}
              className="line-height-sans-4 deep-underline"
            >
              {t('keyContactDirectory.renameCategory')}
            </Button>
            <div className="display-inline height-full width-1px border-left border-width-1px border-base-light margin-x-2" />
            <Button
              type="button"
              unstyled
              onClick={() => {}}
              className="line-height-sans-4 text-error deep-underline"
            >
              {t('keyContactDirectory.removeCategory')}
            </Button>
          </div>
        )}
        <KeyContactTable
          smes={reformattedSmes[category.id] || []}
          isAssessmentTeam={isAssessmentTeam}
          isSearching={query.trim() !== ''}
        />
      </>
    ),
    expanded: true,
    id: category.id,
    headingLevel: 'h4'
  }));

  if (loadingSmes) {
    return <PageLoading testId="key-contact-directory" />;
  }

  return (
    <div
      id={convertToLowercaseAndDashes(t('keyContactDirectory.jumpToLabel'))}
      className="padding-y-4 padding-bottom-6 margin-bottom-neg-7"
      style={{ scrollMarginTop: '3.5rem' }}
    >
      <GridContainer>
        <div>
          <h2 className="margin-0">{t('keyContactDirectory.header')}</h2>

          <p className="margin-top-1 margin-bottom-2 font-body-md line-height-sans-4">
            {isAssessmentTeam ? (
              t('keyContactDirectory.descriptionForAssessment')
            ) : (
              <Trans
                i18nKey="helpAndKnowledge:keyContactDirectory.descriptionForGeneral"
                components={{
                  email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
                }}
              />
            )}
          </p>

          {isAssessmentTeam && (
            <div className="margin-bottom-4">
              <Button
                type="button"
                unstyled
                onClick={() => {}}
                className="line-height-sans-4"
              >
                {t('keyContactDirectory.addSubjectCategory')}
              </Button>
              <div className="display-inline height-full width-1px border-left border-width-1px border-base-light margin-x-2" />
              <Button
                type="button"
                unstyled
                onClick={() => {
                  setIsSmeModalOpen(true);
                  setSmeModalMode('addWithoutCategory');
                }}
                className="line-height-sans-4"
              >
                {t('keyContactDirectory.addSme')}
              </Button>
            </div>
          )}
        </div>

        <Grid tablet={{ col: 6 }}>
          {/* Search bar and results info */}
          <GlobalClientFilter
            globalFilter={query}
            setGlobalFilter={setQuery}
            resetPageOnEmptyFilter={false}
            tableID="key-contact-directory-table"
            tableName="key-contact-directory"
            className="margin-y-4 maxw-none tablet:width-mobile-lg"
          />

          {query.trim() !== '' && (
            <div role="status" aria-live="polite" className="margin-bottom-2">
              {t('keyContactDirectory.resultsFor', {
                count: filteredSmes.length,
                query
              })}
            </div>
          )}
        </Grid>

        {categories.length === 0 && (
          <Alert
            type="info"
            heading={t('keyContactDirectory.emptyDirectoryHeading')}
          >
            <Trans
              i18nKey={
                isAssessmentTeam
                  ? 'helpAndKnowledge:keyContactDirectory.emptyDirectoryInfoForAssessment'
                  : 'helpAndKnowledge:keyContactDirectory.emptyDirectoryInfoForGeneral'
              }
              components={{
                email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
              }}
            />
          </Alert>
        )}

        {categories.length > 0 && (
          <Accordion
            className="margin-bottom-3 key-contact-accordion"
            bordered={false}
            multiselectable
            items={accordionItems}
          />
        )}
      </GridContainer>
    </div>
  );
};

export default KeyContactDirectory;
