import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
  Icon,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import { OperationalSolutionKey } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import ScrollLink from 'components/ScrollLink';
import useModalSolutionState from 'hooks/useModalSolutionState';
import { covertToLowercaseAndDashes } from 'utils/modelPlan';
import { tArray } from 'utils/translation';

import { ArticleCategories, HelpArticle } from '..';

const SixPagerMeeting = () => {
  const { t: sixPageMeetingT } = useTranslation('sixPageMeeting');

  const location = useLocation();

  const [initLocation] = useState<string>(location.pathname);

  const { prevPathname, selectedSolution, renderModal, loading } =
    useModalSolutionState(OperationalSolutionKey.LDG);

  const ldgRoute = `${initLocation}${location.search}${
    location.search ? '&' : '?'
  }solution=learning-and-diffusion-group&section=about`;

  const sections = tArray('sixPageMeeting:summaryBox.sections');

  const crossCuttingGroups = tArray('sixPageMeeting:aboutConceptPapers.items');

  const conceptPaperSectionOne = tArray(
    'sixPageMeeting:aboutConceptPapers.sectionOne.items'
  );

  const conceptPaperSectionTwo = tArray<Record<string, any>>(
    'sixPageMeeting:aboutConceptPapers.sectionTwo.items'
  );

  const conceptPaperSectionThree = tArray<Record<string, any>>(
    'sixPageMeeting:aboutConceptPapers.sectionThree.items'
  );

  const conceptPaperSectionFour = tArray<Record<string, any>>(
    'sixPageMeeting:aboutConceptPapers.sectionFour.items'
  );

  const tipsToLearn = tArray<Record<string, any>>(
    'sixPageMeeting:tipsSummaryBox.items'
  );

  const additionalResourcesListItems = tArray(
    'sixPageMeeting:additionalResources.list'
  );

  const additionalResourcesParagraphs = tArray(
    'sixPageMeeting:additionalResources.paragraph'
  );

  const tipsList = tArray('sixPageMeeting:reviewMeeting.subheading.tip.list');

  const outcomesParagraphs = tArray(
    'sixPageMeeting:reviewMeeting.subheading.outcomes.paragraph'
  );

  if (loading) {
    return <PageLoading />;
  }

  return (
    <>
      {renderModal && selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute="/help-and-knowledge/how-to-have-a-successful-6-pager-meeting"
        />
      )}

      <MainContent className="line-height-sans-5">
        <GridContainer>
          <Grid>
            <HelpBreadcrumb text={sixPageMeetingT('title')} />

            <PageHeading className="margin-bottom-1">
              {sixPageMeetingT('title')}
            </PageHeading>

            <HelpCategoryTag
              type={ArticleCategories.MODEL_CONCEPT_AND_DESIGN}
              className="margin-bottom-1"
            />

            <p className="font-body-lg margin-top-0 margin-bottom-4">
              {sixPageMeetingT('description')}
            </p>

            <SummaryBox className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2">
              <SummaryBoxHeading headingLevel="h3">
                {sixPageMeetingT('summaryBox.heading')}
              </SummaryBoxHeading>

              <SummaryBoxContent>
                <ul className="margin-y-0 padding-top-1">
                  {sections.map(section => (
                    <li className="margin-top-05 margin-bottom-1" key={section}>
                      <ScrollLink scrollTo={section} />
                    </li>
                  ))}
                </ul>
              </SummaryBoxContent>
            </SummaryBox>

            <div
              id={covertToLowercaseAndDashes(
                sixPageMeetingT('summaryBox.sections.0')
              )}
            >
              <h2 className="margin-y-2">
                {sixPageMeetingT('keyResources.heading')}
              </h2>

              <p>{sixPageMeetingT('keyResources.description')}</p>

              <KeyResourcesPageCards />
            </div>

            <div
              id={covertToLowercaseAndDashes(
                sixPageMeetingT('summaryBox.sections.1')
              )}
            >
              <h2 className="margin-y-2">
                {sixPageMeetingT('modelPlansInMINT.heading')}
              </h2>

              <p>{sixPageMeetingT('modelPlansInMINT.description')}</p>

              <SummaryBox className="padding-3 margin-y-3">
                <SummaryBoxHeading
                  headingLevel="h3"
                  className="margin-bottom-1"
                >
                  {sixPageMeetingT('modelPlansInMINT.summaryBox.heading')}
                </SummaryBoxHeading>

                <SummaryBoxContent>
                  <UswdsReactLink
                    to={sixPageMeetingT(
                      'modelPlansInMINT.summaryBox.linkOne.link'
                    )}
                    className="display-flex flex-align-center"
                  >
                    {sixPageMeetingT(
                      'modelPlansInMINT.summaryBox.linkOne.text'
                    )}

                    <Icon.ArrowForward className="margin-left-1" />
                  </UswdsReactLink>
                </SummaryBoxContent>
              </SummaryBox>
            </div>

            <div
              id={covertToLowercaseAndDashes(
                sixPageMeetingT('summaryBox.sections.2')
              )}
            >
              <h2 className="margin-y-2 margin-top-4">
                {sixPageMeetingT('aboutConceptPapers.heading')}
              </h2>

              <p>{sixPageMeetingT('aboutConceptPapers.description')}</p>

              <ul className="margin-y-0">
                {crossCuttingGroups.map((item, index) => (
                  <li key={item}>
                    <Trans
                      i18nKey={`aboutConceptPapers.items.${index}`}
                      t={sixPageMeetingT}
                      components={{
                        link1: (
                          <UswdsReactLink
                            className="usa-button usa-button--unstyled"
                            to={ldgRoute}
                          >
                            {' '}
                          </UswdsReactLink>
                        )
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <Alert type="info" className="margin-y-3">
              <div style={{ whiteSpace: 'pre' }}>
                <Trans
                  i18nKey="paperTemplateAlert"
                  t={sixPageMeetingT}
                  components={{
                    link1: (
                      <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Model%20and%20Initiative%20Templates/2024%20Model%20Templates/Model%20Development%202-pager%20Template%205.24%20CLEAN.docx">
                        {' '}
                      </ExternalLink>
                    )
                  }}
                />
              </div>
            </Alert>

            {/* Section 1 */}
            <div className="margin-bottom-4">
              <h3 className="margin-y-0">
                {sixPageMeetingT('aboutConceptPapers.sectionOne.heading')}
              </h3>

              <ul className="margin-y-0 padding-top-1">
                {conceptPaperSectionOne.map(section => (
                  <li key={section}>{section}</li>
                ))}
              </ul>
            </div>

            {/* Section 2 */}
            <div className="margin-bottom-4">
              <h3 className="margin-y-0">
                {sixPageMeetingT('aboutConceptPapers.sectionTwo.heading')}
              </h3>

              <ul className="margin-y-0 padding-top-1">
                {conceptPaperSectionTwo.map(section => (
                  <li key={section.heading}>
                    {section.heading}
                    <ul className="margin-y-0 padding-top-1">
                      {section.items.map((item: string) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3 */}
            <div className="margin-bottom-4">
              <h3 className="margin-y-0">
                {sixPageMeetingT('aboutConceptPapers.sectionThree.heading')}
              </h3>

              <ul className="margin-y-0 padding-top-1">
                {conceptPaperSectionThree.map((section, index) => (
                  <li key={section.heading}>
                    <Trans
                      i18nKey={`aboutConceptPapers.sectionThree.items.${index}.heading`}
                      t={sixPageMeetingT}
                      components={{
                        bold: <strong />,
                        link1: (
                          <ExternalLink
                            href={sixPageMeetingT(
                              `aboutConceptPapers.sectionThree.items.${index}.link`
                            )}
                          >
                            {' '}
                          </ExternalLink>
                        )
                      }}
                    />
                    {section.items.length > 0 && (
                      <ul className="margin-y-0 padding-top-1">
                        {section.items.map((item: string) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 4 */}
            <div className="margin-bottom-4">
              <h3 className="margin-y-0">
                {sixPageMeetingT('aboutConceptPapers.sectionFour.heading')}
              </h3>

              <ul className="margin-y-0 padding-top-1">
                {conceptPaperSectionFour.map(section => (
                  <li key={section.heading}>
                    {section.heading}
                    <ul className="margin-y-0 padding-top-1">
                      {section.items.map((item: string) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips to learn */}
            <SummaryBox className="margin-bottom-3">
              <SummaryBoxHeading headingLevel="h3">
                {sixPageMeetingT('tipsSummaryBox.heading')}
              </SummaryBoxHeading>

              <SummaryBoxContent>
                <ul className="margin-y-0 padding-top-1">
                  {tipsToLearn.map((section, index) => (
                    <li key={section.heading} className="padding-bottom-05">
                      <Trans
                        i18nKey={`tipsSummaryBox.items.${index}.text`}
                        t={sixPageMeetingT}
                        components={{
                          link1: (
                            <ExternalLink
                              href={sixPageMeetingT(
                                `tipsSummaryBox.items.${index}.link`
                              )}
                            >
                              {' '}
                            </ExternalLink>
                          )
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </SummaryBoxContent>
            </SummaryBox>

            <SummaryBox className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2 margin-y-0">
              <SummaryBoxHeading headingLevel="h3">
                {sixPageMeetingT('conceptPaper.exampleSummaryBox.heading')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <p className="margin-y-1">
                  {sixPageMeetingT('conceptPaper.exampleSummaryBox.paragraph')}
                </p>
                <ul className="margin-top-0">
                  <li>
                    <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/AHEAD%20Concept%20Paper.docx?d=w9bd3973322384706a0207c756f773739">
                      {sixPageMeetingT(
                        'conceptPaper.exampleSummaryBox.items.one'
                      )}
                    </ExternalLink>
                  </li>
                  <li>
                    <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Six%20Pagers/AHEAD%206-page%20concept_Clean.docx?d=wbdf205743dac4ebaa2a99ea37af6b5a7">
                      {sixPageMeetingT(
                        'conceptPaper.exampleSummaryBox.items.two'
                      )}
                    </ExternalLink>
                  </li>
                  <li>
                    <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Six%20Pagers/Enhancing%20Oncology%20Model%20(formerly%20OncT)%206-pager_10252021_clean.docx?d=w1e0f202072d14d8fb64366aff294e415">
                      {sixPageMeetingT(
                        'conceptPaper.exampleSummaryBox.items.three'
                      )}
                    </ExternalLink>
                  </li>
                </ul>
                <span className="margin-y-0">
                  {sixPageMeetingT(
                    'conceptPaper.exampleSummaryBox.footer.copy'
                  )}
                  <ExternalLink href="https://share.cms.gov/center/CMMI/SR/ModelDev/Forms/AllItems.aspx">
                    {sixPageMeetingT(
                      'conceptPaper.exampleSummaryBox.footer.link'
                    )}
                  </ExternalLink>
                </span>
              </SummaryBoxContent>
            </SummaryBox>

            <div
              id={covertToLowercaseAndDashes(
                sixPageMeetingT('summaryBox.listItem.determine')
              )}
              className="margin-bottom-6"
            >
              <h2 className="margin-bottom-3">
                {sixPageMeetingT('summaryBox.listItem.determine')}
              </h2>
              <p className="margin-top-0 margin-bottom-3 ">
                {sixPageMeetingT('additionalResources.intro')}
              </p>

              <h3 className="margin-top-0 margin-bottom-1">
                {sixPageMeetingT('additionalResources.subheading')}
              </h3>
              <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                {additionalResourcesListItems.map(k => (
                  <li key={k} className=" margin-bottom-05">
                    {k}
                  </li>
                ))}
              </ul>
              {additionalResourcesParagraphs.map(k => (
                <p key={k} className=" margin-top-0 margin-bottom-3">
                  {k}
                </p>
              ))}
            </div>

            <div
              id={covertToLowercaseAndDashes(
                sixPageMeetingT('summaryBox.listItem.review')
              )}
              className="margin-bottom-6"
            >
              <h2 className="margin-bottom-3">
                {sixPageMeetingT('summaryBox.listItem.review')}
              </h2>
              <p className="margin-top-0 margin-bottom-3 ">
                {sixPageMeetingT('reviewMeeting.intro')}
                <i>{sixPageMeetingT('reviewMeeting.italicsNowWhat')}</i>
              </p>

              <h3 className="margin-top-0 margin-bottom-1">
                {sixPageMeetingT('reviewMeeting.subheading.tip.text')}
              </h3>
              <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                {tipsList.map(k => (
                  <li key={k} className=" margin-bottom-05">
                    {k}
                  </li>
                ))}
              </ul>

              <h3 className="margin-top-0 margin-bottom-1">
                {sixPageMeetingT('reviewMeeting.subheading.outcomes.text')}
              </h3>
              {outcomesParagraphs.map(k => (
                <p key={k} className=" margin-top-0 margin-bottom-3">
                  {k}
                </p>
              ))}
            </div>

            <SummaryBox>
              <SummaryBoxHeading headingLevel="h3">
                {sixPageMeetingT('footerSummaryBox.title')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <Trans i18nKey="sixPageMeeting:footerSummaryBox.body">
                  indexZero
                  <ExternalLink href="mailto:MINTTeam@cms.hhs.gov">
                    email
                  </ExternalLink>
                  indexTwo
                </Trans>
              </SummaryBoxContent>
            </SummaryBox>
          </Grid>
        </GridContainer>
      </MainContent>
      <div className="margin-top-6 margin-bottom-neg-7">
        <RelatedArticles
          currentArticle={HelpArticle.SIX_PAGER_MEETING}
          specificArticles={[
            HelpArticle.TWO_PAGER_MEETING,
            HelpArticle.HIGH_LEVEL_PROJECT_PLAN,
            HelpArticle.SAMPLE_MODEL_PLAN
          ]}
          viewAllLink
        />
      </div>
    </>
  );
};

export const KeyResourcesPageCards = () => {
  const { t: sixPageMeetingT } = useTranslation('sixPageMeeting');

  return (
    <Grid row gap>
      <CardGroup>
        <Grid
          tablet={{ col: 6 }}
          desktop={{ col: 6 }}
          className="display-flex flex-align-stretch"
        >
          <Card
            containerProps={{
              className: 'radius-md shadow-2 padding-2'
            }}
            data-testid="article-card"
          >
            <CardHeader className="padding-0">
              <h4 className="line-height-body-4 margin-bottom-1">
                {sixPageMeetingT('keyResources.cardOne.heading')}
              </h4>
            </CardHeader>

            <CardBody className="padding-0 line-height-sans-6">
              <ExternalLink
                href={sixPageMeetingT('keyResources.cardOne.linkOne.link')}
              >
                {sixPageMeetingT('keyResources.cardOne.linkOne.text')}
              </ExternalLink>

              <ExternalLink
                href={sixPageMeetingT('keyResources.cardOne.linkTwo.link')}
              >
                {sixPageMeetingT('keyResources.cardOne.linkTwo.text')}
              </ExternalLink>
            </CardBody>
          </Card>
        </Grid>

        <Grid
          tablet={{ col: 6 }}
          desktop={{ col: 6 }}
          className="display-flex flex-align-stretch"
        >
          <Card
            containerProps={{
              className: 'radius-md shadow-2 padding-2'
            }}
            className="width-full"
            data-testid="article-card"
          >
            <CardHeader className="padding-0">
              <h4 className="line-height-body-4 margin-bottom-1">
                {sixPageMeetingT('keyResources.cardTwo.heading')}
              </h4>

              <p className="margin-y-0 text-base">
                {sixPageMeetingT('keyResources.cardTwo.hint')}
              </p>
            </CardHeader>

            <CardBody className="padding-0 line-height-sans-6">
              <ExternalLink
                href={sixPageMeetingT('keyResources.cardTwo.linkOne.link')}
              >
                {sixPageMeetingT('keyResources.cardTwo.linkOne.text')}
              </ExternalLink>
            </CardBody>
          </Card>
        </Grid>
      </CardGroup>
    </Grid>
  );
};

export default SixPagerMeeting;
