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
  useGetAllKeyContactCategoriesQuery,
  useGetAllKeyContactsQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';
import { isAssessment } from 'utils/user';

import CategoryModal, {
  KeyContactCategoryType
} from './_components/CategoryModal';
import KeyContactTable from './_components/KeyContactTable';
import SmeModal from './_components/SmeModal';

import './index.scss';

const AddCategoryButton = () => {
  const { t } = useTranslation('helpAndKnowledge');
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {isModalOpen && (
        <CategoryModal
          isOpen={isModalOpen}
          mode="add"
          closeModal={() => setIsModalOpen(false)}
        />
      )}
      <Button
        type="button"
        unstyled
        onClick={() => setIsModalOpen(true)}
        className="line-height-sans-4"
      >
        {t('keyContactDirectory.addSubjectCategory')}
      </Button>
    </>
  );
};

const RenameCategoryButton = ({
  category
}: {
  category: KeyContactCategoryType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {isModalOpen && (
        <CategoryModal
          isOpen={isModalOpen}
          mode="edit"
          closeModal={() => setIsModalOpen(false)}
          category={category}
        />
      )}
      <Button
        type="button"
        unstyled
        onClick={() => setIsModalOpen(true)}
        className="line-height-sans-4 deep-underline"
      >
        {t('keyContactDirectory.renameCategory')}
      </Button>
    </>
  );
};

const AddSmeWithoutCategoryButton = ({
  categories
}: {
  categories: KeyContactCategoryType[];
}) => {
  const { t } = useTranslation('helpAndKnowledge');
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {isModalOpen && (
        <SmeModal
          isOpen={isModalOpen}
          mode="addWithoutCategory"
          allCategories={categories}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
      <Button
        type="button"
        unstyled
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="line-height-sans-4 deep-underline padding-0"
      >
        {t('keyContactDirectory.addSme')}
      </Button>
    </>
  );
};

const AddSmeWithCategoryButton = ({
  category
}: {
  category: KeyContactCategoryType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {isModalOpen && (
        <SmeModal
          isOpen={isModalOpen}
          mode="addWithCategory"
          closeModal={() => setIsModalOpen(false)}
          category={category}
        />
      )}
      <Button
        type="button"
        unstyled
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="line-height-sans-4 deep-underline padding-0"
      >
        {t('keyContactDirectory.addSmeToCategory')}
      </Button>
    </>
  );
};

export type SmeType = GetAllKeyContactsQuery['keyContacts'][number];

const KeyContactDirectory = () => {
  const { t } = useTranslation('helpAndKnowledge');

  // Used to check if user is assessment for rendering different content and access
  const { groups } = useSelector((state: AppState) => state.auth);
  const flags = useFlags();

  const [query, setQuery] = useState('');

  const isAssessmentTeam = isAssessment(groups, flags);

  const { data: categoryData, loading: loadingCategories } =
    useGetAllKeyContactCategoriesQuery();

  const { data: smeData, loading: loadingSmes } = useGetAllKeyContactsQuery();

  const categories = useMemo(() => {
    if (!categoryData) {
      return [];
    }

    return [...categoryData.keyContactCategory].sort((a, b) =>
      a.category.localeCompare(b.category)
    );
  }, [categoryData]);

  const filteredSmes = useMemo(() => {
    if (!smeData) {
      return [];
    }
    const trimmedQuery = query.toLowerCase().trim();
    let smeContacts = smeData.keyContacts;

    if (trimmedQuery !== '') {
      const filteredCategoryIds = categories
        .filter(category =>
          category.category.toLowerCase().includes(trimmedQuery)
        )
        .map(cat => cat.id);

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
  }, [categories, query, smeData]);

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
        {isAssessmentTeam && (
          <div className="margin-top-2">
            <AddSmeWithCategoryButton category={category} />
            <div className="display-inline height-full width-1px border-left border-width-1px border-base-light margin-x-2" />
            <RenameCategoryButton category={category} />
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
        {loadingSmes ? (
          <PageLoading testId="key-contact-table" />
        ) : (
          <KeyContactTable
            smes={reformattedSmes[category.id] || []}
            allCategories={categories}
            isAssessmentTeam={isAssessmentTeam}
            isSearching={query.trim() !== ''}
          />
        )}
      </>
    ),
    expanded: true,
    id: category.id,
    headingLevel: 'h4'
  }));

  if (loadingCategories) {
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
              <AddCategoryButton />
              <div className="display-inline height-full width-1px border-left border-width-1px border-base-light margin-x-2" />
              <AddSmeWithoutCategoryButton categories={categories} />
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
