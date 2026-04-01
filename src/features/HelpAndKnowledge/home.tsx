import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { GridContainer, SummaryBox } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';

import KeyContactDirectory from './_components/KeyContactDirectory';
import MilestoneLibrarySection from './_components/MilestoneLibrarySection';
import ArticlePageInfo from './Articles/_components/ArticlePageInfo';
import HelpCardGroup from './Articles/_components/HelpCardGroup';
import ResourcesByCategory from './Articles/_components/ResourcesByCategory';
import SolutionCategories from './SolutionsHelp/_components/SolutionCategories';
import { homeArticles } from './Articles';

const JUMP_TO_LINKS_I18NKEYS = [
  'helpResourcesAndLinks',
  'milestoneLibrary.hkcJumpToLabel',
  'operationalSolutionsAndITSystems',
  'keyContactDirectory.jumpToLabel'
];

export const HelpAndKnowledgeHome = () => {
  const { t } = useTranslation('helpAndKnowledge');

  const { hash } = useLocation();

  // This handles when there's # in url and scroll to section
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (hash) {
      timer = setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [hash]);

  // This handles updating the url on scroll to match the section in view
  useEffect(() => {
    let rafId: number | null = null;

    const targetIds = JUMP_TO_LINKS_I18NKEYS.map(key =>
      convertToLowercaseAndDashes(t(key))
    );

    const updateUrlOnScroll = () => {
      targetIds.forEach(id => {
        const element = document.getElementById(id);
        if (!element) return;

        const rect = element.getBoundingClientRect();

        if (rect.top >= 0 && rect.top <= 80) {
          if (window.location.hash !== `#${id}`) {
            window.history.replaceState(null, '', `#${id}`);
          }
        }
      });
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateUrlOnScroll();
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [t]);

  return (
    <MainContent>
      <SummaryBox
        className="padding-y-6 border-0 bg-primary-lighter padding-x-0"
        data-testid="help-and-knowledge-summary"
      >
        <GridContainer>
          <PageHeading className="margin-0 line-height-sans-2">
            {t('heading')}
          </PageHeading>

          <div className="description-truncated margin-y-2 font-body-lg">
            {t('description')}
          </div>

          <div>
            <p className="display-inline text-bold margin-right-2">
              {t('jumpTo')}:
            </p>
            {JUMP_TO_LINKS_I18NKEYS.map((linkI18nkey, index) => (
              <div className="display-inline" key={linkI18nkey}>
                <UswdsReactLink
                  key={linkI18nkey}
                  to={`#${convertToLowercaseAndDashes(t(linkI18nkey))}`} // 👈 Just the hash for same-page jumping
                  className="usa-link"
                >
                  {t(linkI18nkey)}
                </UswdsReactLink>
                {index < JUMP_TO_LINKS_I18NKEYS.length - 1 && (
                  <div className="display-inline height-full width-1px border-left border-width-1px border-base-light margin-x-2" />
                )}
              </div>
            ))}
          </div>
        </GridContainer>
      </SummaryBox>

      <GridContainer
        id={convertToLowercaseAndDashes(t('helpResourcesAndLinks'))}
        className="padding-top-2"
        style={{ scrollMarginTop: '3.5rem' }}
      >
        <HelpCardGroup
          className="margin-top-2 margin-bottom-1"
          resources={homeArticles}
          homeItems
        />
        <ArticlePageInfo />

        <ResourcesByCategory />
      </GridContainer>

      <MilestoneLibrarySection />

      <SolutionCategories />

      <KeyContactDirectory />
    </MainContent>
  );
};

export default HelpAndKnowledgeHome;
