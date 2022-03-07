import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
  IconFileDownload,
  Link
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import {
  tempCedarSystemProps,
  tempSystemDataProp
} from 'views/Sandbox/mockSystemData';

type SystemDataProps = {
  system: tempCedarSystemProps; // TODO: Once additional CEDAR data is define, change to GQL generated type
};

const SystemData = ({ system }: SystemDataProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  return (
    <div id="system-data">
      <GridContainer className="padding-left-0 padding-right-0">
        <Grid row gap>
          <Grid desktop={{ col: 8 }}>
            <SectionWrapper
              borderBottom
              className="margin-bottom-4 padding-bottom-4"
            >
              <h2 className="margin-top-0">
                {t('singleSystem.systemData.header')}
              </h2>

              {/* TODO: Map and populate tags with CEDAR */}
              <h3 className="margin-top-2 margin-bottom-1">
                {t('singleSystem.systemData.recordCategories')}
              </h3>
              {system?.developmentTags?.map((tag: string) => (
                <Tag
                  key={tag}
                  className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
                >
                  {tag} {/* TODO: Map defined CEDAR variable once availabe */}
                </Tag>
              ))}

              <Grid row className="margin-top-4">
                <Grid tablet={{ col: true }} className="margin-bottom-3">
                  <DescriptionTerm
                    className="display-inline-flex margin-right-1"
                    term={t('singleSystem.systemData.beneficiariesAddress')}
                  />

                  <DescriptionDefinition
                    className="font-body-md line-height-body-3"
                    definition="This system does not use or store beneficiary addresses"
                  />
                </Grid>
              </Grid>

              <Grid row className="margin-top-4">
                <Grid tablet={{ col: true }} className="margin-bottom-3">
                  <DescriptionTerm
                    className="display-inline-flex margin-right-1"
                    term={t('singleSystem.systemData.pII')}
                  />

                  <DescriptionDefinition
                    className="font-body-md line-height-body-3"
                    definition="This system uses PII, but limited only to a username and password"
                  />
                </Grid>
              </Grid>

              <Grid row className="margin-top-4">
                <Grid tablet={{ col: true }}>
                  <DescriptionTerm
                    className="display-inline-flex margin-right-1"
                    term={t('singleSystem.systemData.pHI')}
                  />

                  <DescriptionDefinition
                    className="font-body-md line-height-body-3"
                    definition="The data in this system is not considered PHI"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>
            <SectionWrapper
              borderBottom
              className="margin-bottom-4 padding-bottom-5"
            >
              <h2 className="margin-top-0">
                {t('singleSystem.systemData.apiInfo')}
              </h2>

              <Grid row className="margin-top-3">
                <Grid tablet={{ col: 6 }} className="margin-bottom-5">
                  <DescriptionTerm
                    className="display-inline-flex margin-right-1"
                    term={t('singleSystem.systemData.apiStatus')}
                  />

                  <DescriptionDefinition
                    className="font-body-md line-height-body-3"
                    definition="API developed and launched"
                  />
                </Grid>
                <Grid tablet={{ col: 6 }} className="margin-bottom-5">
                  <DescriptionTerm
                    className="display-inline-flex margin-right-1"
                    term={t('singleSystem.systemData.fHIRUsage')}
                  />

                  <DescriptionDefinition
                    className="line-height-body-3 font-body-md"
                    definition="This API does not use FHIR"
                  />
                </Grid>
                <Grid tablet={{ col: 6 }} className="margin-bottom-5">
                  <DescriptionTerm
                    className="display-inline-flex margin-right-1"
                    term={t('singleSystem.systemData.apiGateway')}
                  />

                  <DescriptionDefinition
                    className="line-height-body-3 margin-bottom-2"
                    definition="Kong"
                  />
                  {/* TODO: Add hash-fragment to direct and scroll on the tools subpage */}
                  <UswdsReactLink to="tools-and-software">
                    {t('singleSystem.systemData.viewGateway')}
                  </UswdsReactLink>
                </Grid>
                <Grid tablet={{ col: 6 }} className="margin-bottom-5">
                  <DescriptionTerm
                    className="display-inline-flex margin-right-1"
                    term={t('singleSystem.systemData.access')}
                  />

                  <DescriptionDefinition
                    className="line-height-body-3"
                    definition="Internal and external access"
                  />
                </Grid>
              </Grid>

              {/* TODO: Map and populate tags with CEDAR */}
              <h3 className="margin-top-0 margin-bottom-1">
                {t('singleSystem.systemData.dataCategories')}
              </h3>
              {system?.developmentTags?.map((tag: string) => (
                <Tag
                  key={tag}
                  className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
                >
                  {tag} {/* TODO: Map defined CEDAR variable once availabe */}
                </Tag>
              ))}
            </SectionWrapper>

            <SectionWrapper
              borderBottom={isMobile}
              className="margin-bottom-4 padding-bottom-5"
            >
              <h2 className="margin-top-0">
                {t('singleSystem.systemData.dataExchanges')}
              </h2>

              <CardGroup className="margin-0">
                {system?.systemData?.map((data: tempSystemDataProp) => {
                  return (
                    <Card key={data.id} className="grid-col-12 margin-bottom-2">
                      <CardHeader className="padding-2 padding-bottom-0">
                        <div className="margin-bottom-0 easi-header__basic flex-align-baseline">
                          <h3 className="margin-top-0 margin-bottom-1">
                            {data.title}
                          </h3>
                          <Tag
                            className={classnames(
                              'font-body-md',
                              'margin-bottom-1',
                              {
                                'bg-success-dark text-white':
                                  data.status === 'Active' ||
                                  data.status === 'Passed',
                                'bg-warning':
                                  data.status === 'Requires response' ||
                                  data.status === 'QA review pending',
                                'bg-white text-base border-base border-2px':
                                  data.status === 'Not applicable'
                              }
                            )}
                          >
                            {data.status}
                          </Tag>
                        </div>
                        <Tag className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-2">
                          <IconFileDownload className="text-base-darker margin-right-1" />
                          Receives Data{' '}
                          {/* TODO: Map defined CEDAR variable once availabe */}
                        </Tag>
                        <Divider />
                      </CardHeader>
                      <CardBody className="padding-2">
                        <GridContainer className="padding-x-0 margin-bottom-2">
                          <Grid row>
                            <Grid col>
                              <div className="margin-bottom-0 easi-header__basic flex-align-baseline">
                                <DescriptionTerm
                                  className="display-inline-flex margin-right-1"
                                  term={t(
                                    'singleSystem.systemData.dataPartner'
                                  )}
                                />

                                <Tag
                                  className={classnames(
                                    'font-body-md',
                                    'margin-bottom-1',
                                    {
                                      'bg-success-dark text-white':
                                        data.dataPartnerStatus === 'Active' ||
                                        data.dataPartnerStatus === 'Passed',
                                      'bg-warning':
                                        data.dataPartnerStatus ===
                                          'Requires response' ||
                                        data.dataPartnerStatus ===
                                          'QA review pending',
                                      'bg-white text-base border-base border-2px':
                                        data.dataPartnerStatus ===
                                        'Not applicable'
                                    }
                                  )}
                                >
                                  {data.dataPartnerStatus}
                                </Tag>
                              </div>
                              <DescriptionDefinition
                                className="line-height-body-3"
                                definition={data.dataPartner}
                              />
                            </Grid>
                          </Grid>
                        </GridContainer>
                        <Divider />
                      </CardBody>
                      <CardFooter className="padding-2 padding-top-0">
                        <GridContainer className="padding-x-0">
                          <Grid row>
                            <Grid col>
                              <div className="margin-bottom-0 easi-header__basic flex-align-center">
                                <DescriptionTerm
                                  term={t(
                                    'singleSystem.systemData.qualityAssurance'
                                  )}
                                />
                                <Tag
                                  className={classnames(
                                    'font-body-md',
                                    'margin-bottom-1',
                                    {
                                      'bg-success-dark text-white':
                                        data.qualityStatus === 'Active' ||
                                        data.qualityStatus === 'Passed',
                                      'bg-warning':
                                        data.qualityStatus ===
                                          'Requires response' ||
                                        data.qualityStatus ===
                                          'QA review pending',
                                      'bg-white text-base border-base border-2px':
                                        data.qualityStatus === 'Not applicable'
                                    }
                                  )}
                                >
                                  {data.qualityStatus}
                                </Tag>
                              </div>
                            </Grid>
                          </Grid>
                        </GridContainer>
                      </CardFooter>
                    </Card>
                  );
                })}
              </CardGroup>
            </SectionWrapper>
          </Grid>
          {/* Point of contact/ miscellaneous info */}
          <Grid
            tablet={{ col: 4 }}
            className={classnames({
              'sticky-nav': !isMobile
            })}
          >
            {/* Setting a ref here to reference the grid width for the fixed side nav */}
            <div className="side-divider">
              <div className="top-divider" />
              <p className="font-body-xs margin-top-1 margin-bottom-3">
                {t('singleSystem.pointOfContact')}
              </p>
              <h3 className="system-profile__subheader margin-bottom-1">
                Geraldine Hobbs
              </h3>
              <DescriptionDefinition
                definition={t('singleSystem.summary.subheader2')}
              />
              <p>
                <Link
                  aria-label={t('singleSystem.sendEmail')}
                  className="line-height-body-5"
                  href="mailto:patrick.segura@oddball.io" // TODO: Get link from CEDAR?
                  variant="external"
                  target="_blank"
                >
                  {t('singleSystem.sendEmail')}
                  <span aria-hidden>&nbsp;</span>
                </Link>
              </p>
              <p>
                <Link
                  aria-label={t('singleSystem.moreContact')}
                  className="line-height-body-5"
                  href="mailto:patrick.segura@oddball.io" // TODO: Get link from CEDAR?
                  target="_blank"
                >
                  {t('singleSystem.moreContact')}
                  <span aria-hidden>&nbsp;</span>
                  <span aria-hidden>&rarr; </span>
                </Link>
              </p>
            </div>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
};

export default SystemData;
