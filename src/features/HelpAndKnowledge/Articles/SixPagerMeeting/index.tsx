import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  GridContainer,
  Icon,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
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

import KeyResourcesCards from '../_components/KeyResourcesCards';
import SimpleList from '../_components/SimpleList';
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

  const conceptPaperSectionFive = tArray(
    'sixPageMeeting:aboutConceptPapers.sectionFive.items'
  );

  const conceptPaperSectionSix = tArray(
    'sixPageMeeting:aboutConceptPapers.sectionSix.items'
  );

  const conceptPaperSectionSeven = tArray(
    'sixPageMeeting:aboutConceptPapers.sectionSeven.items'
  );

  const tipsToLearn = tArray<Record<string, any>>(
    'sixPageMeeting:aboutConceptPapers.tipsSummaryBox.items'
  );

  const conceptPaperAdditionalResources = tArray<Record<string, any>>(
    'sixPageMeeting:aboutConceptPapers.additionalResources.items'
  );

  const tipsForModelTeamsSummary = tArray<Record<string, any>>(
    'sixPageMeeting:aboutConceptPapers.tipsForModelTeamsSummary.items'
  );

  const example6Pager = tArray<Record<string, any>>(
    'sixPageMeeting:aboutConceptPapers.example6Pager.items'
  );

  const tipsToLearnAdditionalResources = tArray<string>(
    'sixPageMeeting:additionalResources.tipsSummaryBox.items'
  );

  const tipsToLearnSixPagerReviewed = tArray<string>(
    'sixPageMeeting:howSixPagerReviewed.tipsSummaryBox.items'
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
              className="margin-bottom-4"
            >
              <h2 className="margin-y-2">
                {sixPageMeetingT('keyResources.heading')}
              </h2>

              <p>{sixPageMeetingT('keyResources.description')}</p>

              <KeyResourcesCards />
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
              <SimpleList
                list={conceptPaperSectionOne}
                heading={sixPageMeetingT(
                  'aboutConceptPapers.sectionOne.heading'
                )}
              />

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
                          <li key={item} style={{ listStyleType: 'disc' }}>
                            {item}
                          </li>
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
                            <li key={item} style={{ listStyleType: 'disc' }}>
                              {item}
                            </li>
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
                          <li key={item} style={{ listStyleType: 'disc' }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips to learn */}
              <SummaryBox className="margin-bottom-3">
                <SummaryBoxHeading headingLevel="h3">
                  {sixPageMeetingT('aboutConceptPapers.tipsSummaryBox.heading')}
                </SummaryBoxHeading>

                <SummaryBoxContent>
                  <ul className="margin-y-0 padding-top-1">
                    {tipsToLearn.map((section, index) => (
                      <li key={section.heading} className="padding-bottom-05">
                        <Trans
                          i18nKey={`aboutConceptPapers.tipsSummaryBox.items.${index}.text`}
                          t={sixPageMeetingT}
                          components={{
                            link1: (
                              <ExternalLink
                                href={sixPageMeetingT(
                                  `aboutConceptPapers.tipsSummaryBox.items.${index}.link`
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

              {/* Section 5 */}
              <SimpleList
                list={conceptPaperSectionFive}
                heading={sixPageMeetingT(
                  'aboutConceptPapers.sectionFive.heading'
                )}
              />

              {/* Section 6 */}
              <SimpleList
                list={conceptPaperSectionSix}
                heading={sixPageMeetingT(
                  'aboutConceptPapers.sectionSix.heading'
                )}
              />

              {/* Section 7 */}
              <SimpleList
                list={conceptPaperSectionSeven}
                heading={sixPageMeetingT(
                  'aboutConceptPapers.sectionSeven.heading'
                )}
              />

              <SummaryBox className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2 margin-y-0">
                <SummaryBoxHeading headingLevel="h3">
                  {sixPageMeetingT(
                    'aboutConceptPapers.additionalResources.heading'
                  )}
                </SummaryBoxHeading>

                <SummaryBoxContent className="margin-bottom-1">
                  <p className="margin-y-1">
                    <Trans
                      i18nKey="aboutConceptPapers.additionalResources.description"
                      t={sixPageMeetingT}
                      components={{
                        link1: <ExternalLink href="/"> </ExternalLink>
                      }}
                    />
                  </p>

                  <div className="margin-y-0 text-bold">
                    {conceptPaperAdditionalResources.map((section, index) => (
                      <div key={section.heading}>
                        {section.heading}
                        <ul className="margin-top-0 margin-bottom-05 text-normal">
                          {section.items.map(
                            (item2: Record<string, string>, index2: number) => (
                              <li style={{ listStyleType: 'disc' }}>
                                <Trans
                                  i18nKey={`aboutConceptPapers.additionalResources.items.${index}.items.${index2}.text`}
                                  t={sixPageMeetingT}
                                  components={{
                                    link1: <span> </span>
                                  }}
                                  //  TODO: implement links once verified from UX
                                  // components={{
                                  //   link1: (
                                  //     <ExternalLink
                                  //       href={sixPageMeetingT(
                                  //         `aboutConceptPapers.additionalResources.items.${index}.items.${index2}.link`
                                  //       )}
                                  //     >
                                  //       {' '}
                                  //     </ExternalLink>
                                  //   )
                                  // }}
                                />
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </SummaryBoxContent>
              </SummaryBox>

              {/* Tips for model teams */}
              <SummaryBox className="margin-y-3">
                <SummaryBoxHeading headingLevel="h3">
                  {sixPageMeetingT(
                    'aboutConceptPapers.tipsForModelTeamsSummary.heading'
                  )}
                </SummaryBoxHeading>

                <p className="margin-bottom-0">
                  {sixPageMeetingT(
                    'aboutConceptPapers.tipsForModelTeamsSummary.description'
                  )}
                </p>

                <SummaryBoxContent>
                  <ul className="margin-y-0">
                    {tipsForModelTeamsSummary.map((section, index) => (
                      <li key={section.heading}>
                        {section.heading}

                        {section.items?.length > 0 && (
                          <ul className="margin-y-0">
                            {section.items.map((item: string) => (
                              <li key={item} style={{ listStyleType: 'disc' }}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </SummaryBoxContent>
              </SummaryBox>

              <Grid desktop={{ col: 12 }}>
                <Card
                  containerProps={{
                    className: 'radius-md shadow-2 padding-3 margin-0'
                  }}
                  className="width-full"
                >
                  <CardHeader className="padding-0">
                    <h3 className="line-height-body-4 margin-bottom-1">
                      {sixPageMeetingT(
                        'aboutConceptPapers.example6Pager.heading'
                      )}
                    </h3>

                    <p className="margin-y-0">
                      {sixPageMeetingT(
                        'aboutConceptPapers.example6Pager.description'
                      )}
                    </p>
                  </CardHeader>

                  <CardBody className="padding-0 line-height-sans-6">
                    <ul className="margin-y-0 padding-top-1">
                      {example6Pager.map((section, index) => (
                        <li key={section.text} className="padding-bottom-05">
                          <ExternalLink
                            href={sixPageMeetingT(
                              `aboutConceptPapers.example6Pager.items.${index}.link`
                            )}
                          >
                            {section.text}
                          </ExternalLink>
                        </li>
                      ))}
                    </ul>
                  </CardBody>

                  <CardFooter className="padding-bottom-0 padding-x-0">
                    <Trans
                      i18nKey="aboutConceptPapers.example6Pager.footer"
                      t={sixPageMeetingT}
                      components={{
                        link1: <ExternalLink href=""> </ExternalLink>
                      }}
                    />
                  </CardFooter>
                </Card>
              </Grid>
            </div>

            <div
              id={covertToLowercaseAndDashes(
                sixPageMeetingT('summaryBox.sections.3')
              )}
            >
              <h2 className="margin-y-2">
                {sixPageMeetingT('additionalResources.heading')}
              </h2>

              <p>{sixPageMeetingT('additionalResources.description')}</p>

              <h3 className="margin-y-2">
                {sixPageMeetingT(
                  'additionalResources.pipelineContractors.heading'
                )}
              </h3>

              <p className="text-pre-line">
                {sixPageMeetingT(
                  'additionalResources.pipelineContractors.description'
                )}
              </p>

              {/* Tips to learn */}
              <SummaryBox className="margin-y-3">
                <SummaryBoxHeading headingLevel="h3">
                  {sixPageMeetingT(
                    'additionalResources.tipsSummaryBox.heading'
                  )}
                </SummaryBoxHeading>

                <SummaryBoxContent>
                  <p className="margin-bottom-0 text-pre-line">
                    {sixPageMeetingT(
                      'additionalResources.tipsSummaryBox.description'
                    )}
                  </p>

                  <ul className="margin-y-0">
                    {tipsToLearnAdditionalResources.map((section, index) => (
                      <li key={section} className="padding-bottom-05">
                        {section}
                      </li>
                    ))}
                  </ul>

                  <p className="text-pre-line margin-y-0">
                    {sixPageMeetingT(
                      'additionalResources.tipsSummaryBox.footer'
                    )}
                  </p>
                </SummaryBoxContent>
              </SummaryBox>
            </div>

            <div
              id={covertToLowercaseAndDashes(
                sixPageMeetingT('summaryBox.sections.3')
              )}
            >
              <h2 className="margin-y-2">
                {sixPageMeetingT('howSixPagerReviewed.heading')}
              </h2>

              <p>{sixPageMeetingT('howSixPagerReviewed.description')}</p>

              {/* Tips to learn */}
              <SummaryBox className="margin-y-3">
                <SummaryBoxHeading headingLevel="h3">
                  {sixPageMeetingT(
                    'howSixPagerReviewed.tipsSummaryBox.heading'
                  )}
                </SummaryBoxHeading>

                <SummaryBoxContent>
                  <p className="margin-bottom-0 text-pre-line">
                    {sixPageMeetingT(
                      'howSixPagerReviewed.tipsSummaryBox.description'
                    )}
                  </p>

                  <ul className="margin-y-0">
                    {tipsToLearnSixPagerReviewed.map((section, index) => (
                      <li key={section} className="padding-bottom-05">
                        {section}
                      </li>
                    ))}
                  </ul>
                </SummaryBoxContent>
              </SummaryBox>
            </div>
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

export default SixPagerMeeting;
