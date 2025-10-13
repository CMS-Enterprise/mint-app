import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { MtoTemplateKey, useGetMtoTemplatesQuery } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';
import { MTOModalContext } from 'contexts/MTOModalContext';

import { MTOOption, mtoOptions } from '../../Home';

import '../../index.scss';

const MTOOptionsCard = ({
  mtoType,
  className
}: {
  mtoType: MTOOption;
  className: string;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { setMTOModalOpen: setIsModalOpen, setMTOModalState } =
    useContext(MTOModalContext);

  return (
    <Card
      containerProps={{
        className: 'shadow-2 minh-mobile padding-0 margin-0',
        style: { borderTopLeftRadius: '.65rem', borderTopRightRadius: '.65rem' }
      }}
      data-testid="article-card"
      className={classNames('desktop:grid-col-6 article', className)}
    >
      <div
        className={classNames(
          'display-flex flex-justify bg-base-lightest padding-x-3 padding-y-05 text-white radius-top-lg',
          {
            'bg-green-50': mtoType === 'milestones',
            'indigo-cool-60': mtoType === 'solutions'
          }
        )}
      >
        {t(`optionsCard.${mtoType}.label`).toLocaleUpperCase()}{' '}
        {mtoType === 'milestones' ? (
          <Icon.Flag
            className="margin-right-05"
            style={{ top: '4px' }}
            aria-label="flag"
          />
        ) : (
          <Icon.Build
            className="margin-right-05"
            style={{ top: '4px' }}
            aria-label="build"
          />
        )}
      </div>

      <div className="padding-x-3 padding-bottom-3 display-flex flex-column height-full">
        <CardHeader className="padding-0">
          <h3 className="line-height-body-4 margin-bottom-1 margin-top-3">
            {t(`optionsCard.${mtoType}.header`)}
          </h3>
        </CardHeader>

        <CardBody className="padding-x-0 padding-top-0">
          {t(`optionsCard.${mtoType}.description`)}
        </CardBody>

        <CardFooter className="padding-x-0 padding-top-2 padding-bottom-0">
          <UswdsReactLink
            className="usa-button usa-button--outline display-block width-fit-content text-decoration-none margin-bottom-1"
            aria-label={t(`optionsCard.${mtoType}.buttonText`)}
            to={`/models/${modelID}/collaboration-area/model-to-operations/${mtoType === 'milestones' ? 'milestone-library' : 'solution-library'}`}
          >
            {t(`optionsCard.${mtoType}.buttonText`)}
          </UswdsReactLink>

          <Button
            type="button"
            className="display-block"
            unstyled
            onClick={() => {
              setMTOModalState({
                modalType: mtoType === 'milestones' ? 'milestone' : 'solution'
              });
              setIsModalOpen(true);
            }}
          >
            {t(`optionsCard.${mtoType}.linkText`)}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

const MTOOptionsPanel = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { setMTOModalOpen: setIsModalOpen, setMTOModalState } =
    useContext(MTOModalContext);

  const { data, loading, error } = useGetMtoTemplatesQuery({
    variables: {
      keys: [
        MtoTemplateKey.STANDARD_CATEGORIES,
        MtoTemplateKey.ACO_AND_KIDNEY_MODELS,
        MtoTemplateKey.EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS
      ]
    }
  });

  const templates = data?.mtoTemplates || [];

  return (
    <div className="model-to-operations__options-panel">
      <h2 className="margin-y-0">{t('emptyMTO')}</h2>

      <p className="mint-body-large margin-bottom-0 margin-top-2">
        {t('emptyMTOdescription')}
      </p>

      <Grid row gap={2} className="margin-top-4">
        {mtoOptions.map(option => (
          <MTOOptionsCard
            key={option}
            mtoType={option}
            className="margin-top-2"
          />
        ))}
      </Grid>

      <h3 className="margin-y-0">{t('startWithCategories')}</h3>

      <Grid row gap={2}>
        <Grid desktop={{ col: 6 }}>
          <h5 className="margin-bottom-0 margin-top-2 text-normal">
            {t('aboutTemplates')}
          </h5>
          <p className="mint-body-normal margin-y-0">
            {t('aboutTemplatesDescription')}
          </p>
        </Grid>

        <Grid desktop={{ col: 6 }}>
          <h5 className="margin-bottom-0 margin-top-2 text-normal">
            {t('aboutCategories')}
          </h5>
          <p className="mint-body-normal margin-y-0">
            {t('aboutCategoriesDescription')}
          </p>
        </Grid>
      </Grid>

      {loading ? (
        <div className="margin-top-8 display-flex flex-justify-center">
          <Spinner size="large" />
        </div>
      ) : (
        <>
          {error ? (
            <Alert type="error">
              {t('optionsCard.template.errorFetchingTemplates')}
            </Alert>
          ) : (
            <>
              <div>
                <div className="margin-right-2 margin-top-4 display-inline-block">
                  {t('optionsCard.template.availableTemplates', {
                    selected: templates.length,
                    available: templates.length
                  })}
                </div>
                <UswdsReactLink
                  to={`/models/${modelID}/collaboration-area/model-to-operations/template-library`}
                >
                  {t('optionsCard.template.viewTemplates')}
                </UswdsReactLink>
              </div>

              {templates.map(template => (
                <Card
                  containerProps={{
                    className: 'shadow-2 padding-0 margin-0',
                    style: {
                      borderTopLeftRadius: '.65rem',
                      borderTopRightRadius: '.65rem'
                    }
                  }}
                  key={template.id}
                  data-testid="article-card"
                  className="margin-top-2 margin-bottom-1"
                >
                  <div
                    className={classNames(
                      'display-flex flex-justify bg-base-lightest padding-x-3 padding-y-05 bg-base-lighter radius-top-lg'
                    )}
                  >
                    {t('optionsCard.template.label').toLocaleUpperCase()}{' '}
                    <Icon.GridView
                      className="margin-right-05"
                      style={{ top: '4px' }}
                      aria-label="grid view"
                    />
                  </div>

                  <div className="padding-x-3 display-flex flex-column height-full">
                    <CardBody className="padding-x-0 padding-y-2">
                      <Grid row gap={2}>
                        <Grid desktop={{ col: 9 }} tablet={{ col: 9 }}>
                          <h4 className="line-height-body-4 margin-y-0">
                            {template.name}
                          </h4>

                          {t('optionsCard.template.templateCount', {
                            categoryCount: template.categoryCount,
                            milestoneCount: template.milestoneCount,
                            solutionCount: template.solutionCount
                          })}
                        </Grid>

                        <Grid desktop={{ col: 3 }} tablet={{ col: 3 }}>
                          <div className="display-flex flex-justify-end">
                            <Button
                              type="button"
                              outline
                              onClick={() => {
                                setMTOModalState({
                                  modalType: 'addTemplate',
                                  mtoTemplate: template
                                });
                                setIsModalOpen(true);
                              }}
                            >
                              {t('optionsCard.template.buttonText')}
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                    </CardBody>
                  </div>
                </Card>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MTOOptionsPanel;
