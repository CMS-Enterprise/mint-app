import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
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
import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';

import './index.scss';

type TeamAndContractProps = {
  className?: string;
  children?: React.ReactNode;
  system: CedarSystemProps;
};

const vendorsData = [
  {
    vendors: ['TechSystems, Inc', 'Massive Dynamic'],
    contractAwardDate: 'March 19, 2021',
    popStartDate: 'March 20, 2021',
    popEndDate: 'March 21, 2021',
    contractNumber: 'GS1234567890BA-987654321',
    technologyFunctions: [
      'Application',
      'Delivery',
      'End User',
      'IT Management',
      'Platform',
      'Security & Compliance'
    ],
    assetsOrServices: ['External Labor', 'Software']
  },
  {
    vendors: ['SkyNet'],
    contractAwardDate: 'April 19, 2021',
    popStartDate: 'April 20, 2021',
    popEndDate: 'April 21, 2021',
    contractNumber: 'GS1234567890BA-123456789',
    technologyFunctions: ['Network', 'Storage'],
    assetsOrServices: ['Outside Services']
  }
];

const contactListData = [
  {
    id: '1',
    role: 'Business Owner',
    name: 'Geraldine Hobbs',
    email: 'geraldine.hobbs@cms.hhs.gov',
    org: 'Web and Emerging Technologies Group (WETG)'
  },
  {
    id: '2',
    role: 'System Owner',
    name: 'Bryce Greenwood',
    email: 'bryce.greenwood@cms.hhs.gov',
    org: 'Web and Emerging Technologies Group (WETG)'
  }
];

const pointOfContactData = {
  name: 'Greta May Jones',
  role: 'Contracting Officer’s Representative (COR)',
  email: 'mailto:gmj@gmj.gov'
};

const SystemTeamAndContract = ({
  className,
  children,
  system
}: TeamAndContractProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  return (
    <div id="system-team-and-contract">
      <GridContainer className="padding-left-0 padding-right-0">
        <Grid row gap>
          <Grid desktop={{ col: 8 }}>
            <SectionWrapper borderBottom className="padding-bottom-4">
              <h2 className="margin-top-0 margin-bottom-4">
                {t('singleSystem.teamAndContract.header.teamAndContract')}
              </h2>
              <GridContainer className="padding-x-0">
                <Grid row>
                  <Grid tablet={{ col: true }}>
                    <DescriptionTerm
                      term={t(
                        'singleSystem.teamAndContract.federalFullTimeEmployees'
                      )}
                    />
                    <DescriptionDefinition
                      className="font-body-md line-height-body-3"
                      definition="5"
                    />
                  </Grid>
                  <Grid tablet={{ col: true }}>
                    <DescriptionTerm
                      term={t(
                        'singleSystem.teamAndContract.contractorFullTimeEmployees'
                      )}
                    />
                    <DescriptionDefinition
                      className="font-body-md line-height-body-3"
                      definition="6"
                    />
                  </Grid>
                </Grid>
              </GridContainer>
            </SectionWrapper>
            <SectionWrapper borderBottom className="padding-bottom-5">
              <h2 className="margin-top-5 margin-top-4">
                {t('singleSystem.teamAndContract.header.contractInformation')}
              </h2>
              <CardGroup className="margin-0">
                {vendorsData.map(vendor => {
                  return (
                    <Card className="grid-col-12 margin-bottom-2">
                      <CardHeader className="padding-2 padding-bottom-0">
                        <h5 className="margin-y-0 font-sans-2xs text-normal">
                          {t('singleSystem.teamAndContract.vendors')}
                        </h5>
                        <h3 className="margin-y-0 line-height-body-3">
                          {vendor.vendors.map(name => (
                            <div>{name}</div>
                          ))}
                        </h3>
                        <DescriptionTerm
                          className="padding-top-2"
                          term={t(
                            'singleSystem.teamAndContract.contractAwardDate'
                          )}
                        />
                        <DescriptionDefinition
                          className="font-body-md line-height-body-3"
                          definition={vendor.contractAwardDate}
                        />
                        <Divider className="margin-y-2" />
                      </CardHeader>
                      <CardBody className="padding-2 padding-top-0">
                        <h5 className="margin-top-2 margin-bottom-1 font-sans-2xs text-normal">
                          {t(
                            'singleSystem.teamAndContract.periodOfPerformance'
                          )}
                        </h5>
                        <GridContainer className="padding-x-0">
                          <Grid row>
                            <Grid col>
                              <DescriptionTerm
                                term={t(
                                  'singleSystem.teamAndContract.startDate'
                                )}
                              />
                              <DescriptionDefinition
                                className="font-body-md line-height-body-3"
                                definition={vendor.popStartDate}
                              />
                            </Grid>
                            <Grid col>
                              <DescriptionTerm
                                term={t('singleSystem.teamAndContract.endDate')}
                              />
                              <DescriptionDefinition
                                className="font-body-md line-height-body-3"
                                definition={vendor.popEndDate}
                              />
                            </Grid>
                          </Grid>
                        </GridContainer>
                        <Divider className="margin-y-2" />
                        <h5 className="margin-y-0 font-sans-2xs text-normal">
                          {t('singleSystem.teamAndContract.contractNumber')}
                        </h5>
                        <h3 className="margin-y-0">{vendor.contractNumber}</h3>
                        <h5 className="margin-bottom-0 margin-top-2 font-sans-2xs text-normal">
                          {t(
                            'singleSystem.teamAndContract.technologyFunctions'
                          )}
                        </h5>
                        <div>
                          {vendor.technologyFunctions.map(name => (
                            <Tag
                              key={name}
                              className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
                            >
                              {name}
                            </Tag>
                          ))}
                        </div>
                        <h5 className="margin-bottom-0 margin-top-2 font-sans-2xs text-normal">
                          {t('singleSystem.teamAndContract.assetsOrServices')}
                        </h5>
                        <div>
                          {vendor.assetsOrServices.map(name => (
                            <Tag
                              key={name}
                              className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
                            >
                              {name}
                            </Tag>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </CardGroup>
            </SectionWrapper>
            <h2 className="margin-top-5 margin-bottom-4">
              {t('singleSystem.teamAndContract.header.pointsOfContact')}
            </h2>
            <CardGroup className="margin-0">
              {contactListData.map(contact => (
                <Card key={contact.id} className="grid-col-12 margin-bottom-2">
                  <CardHeader className="padding-2 padding-bottom-0">
                    <h5 className="margin-y-0 font-sans-2xs text-normal">
                      {contact.role}
                    </h5>
                    <h3 className="margin-y-0">{contact.name}</h3>
                    <div>
                      <UswdsReactLink
                        className="line-height-body-5"
                        to={contact.email}
                        variant="external"
                        target="_blank"
                      >
                        {contact.email}
                      </UswdsReactLink>
                    </div>
                    <Divider className="margin-y-2" />
                  </CardHeader>
                  <CardBody className="padding-2">{contact.org}</CardBody>
                </Card>
              ))}
            </CardGroup>
          </Grid>
          <Grid
            desktop={{ col: 4 }}
            className={classnames({
              'sticky-nav': !isMobile
            })}
          >
            <SectionWrapper
              borderTop={isMobile}
              className={classnames({
                'margin-top-5': isMobile,
                'padding-top-5': isMobile
              })}
            >
              <div className="side-divider">
                <div className="top-divider" />
                <p className="font-body-xs margin-top-1 margin-bottom-3">
                  {t('singleSystem.teamAndContract.pointOfContact')}
                </p>
                <h3 className="margin-top-0 margin-bottom-1">
                  {pointOfContactData.name}
                </h3>
                <div className="margin-bottom-1 line-height-body-5">
                  {pointOfContactData.role}
                </div>
                <div className="padding-bottom-2">
                  <Link
                    aria-label={t('singleSystem.teamAndContract.sendAnEmail')}
                    className="line-height-body-5"
                    href={pointOfContactData.email}
                    variant="external"
                    target="_blank"
                  >
                    {t('singleSystem.teamAndContract.sendAnEmail')}
                  </Link>
                </div>
              </div>
            </SectionWrapper>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
};

export default SystemTeamAndContract;
