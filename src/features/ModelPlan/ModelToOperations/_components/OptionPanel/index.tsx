import React from 'react';
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

import UswdsReactLink from 'components/LinkWrapper';

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

  const { modelID } = useParams<{ modelID: string }>();

  return (
    <Card
      containerProps={{
        className: 'radius-lg shadow-2 minh-mobile padding-0 margin-0'
      }}
      data-testid="article-card"
      className={classNames('desktop:grid-col-6 article', className)}
    >
      <div
        style={{ paddingTop: '2px', paddingBottom: '2px' }}
        className={classNames(
          'display-flex flex-justify bg-base-lightest padding-x-3 text-white radius-top-lg',
          {
            'bg-green-50': mtoType === 'milestones',
            'indigo-cool-60': mtoType === 'systems-and-solutions'
          }
        )}
      >
        {t(`optionsCard.${mtoType}.label`).toLocaleUpperCase()}{' '}
        {mtoType === 'milestones' ? (
          <Icon.Flag className="margin-right-05" style={{ top: '4px' }} />
        ) : (
          <Icon.Build className="margin-right-05" style={{ top: '4px' }} />
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
            className="usa-button usa-button--outline display-block width-fit-content text-decoration-none"
            aria-label={t(`optionsCard.${mtoType}.buttonText`)}
            to={`/models/${modelID}/collaboration-area/model-to-operations?view=${mtoType}`}
          >
            {t(`optionsCard.${mtoType}.buttonText`)}
          </UswdsReactLink>

          <UswdsReactLink
            aria-label={t(`optionsCard.${mtoType}.linkText`)}
            className="display-block margin-top-1"
            to={`/models/${modelID}/collaboration-area/model-to-operations/custom-milestone`}
          >
            {t(`optionsCard.${mtoType}.linkText`)}
          </UswdsReactLink>
        </CardFooter>
      </div>
    </Card>
  );
};

const MTOOptionsPanel = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  return (
    <div className="model-to-operations__options-panel">
      <h2 className="margin-y-0">{t('emptyMTO')}</h2>

      <p className="mint-body-large margin-bottom-0 margin-top-2">
        {t('emptyMTOdescription')}
      </p>

      <Grid row gap={2} className="margin-top-4">
        {mtoOptions.map(option => (
          <MTOOptionsCard mtoType={option} className="margin-top-2" />
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

      <Card
        containerProps={{
          className: 'radius-lg shadow-2 padding-0 margin-0'
        }}
        data-testid="article-card"
        className="margin-top-2"
      >
        <div
          style={{ paddingTop: '2px', paddingBottom: '2px' }}
          className={classNames(
            'display-flex flex-justify bg-base-lightest padding-x-3 radius-top-lg bg-base-lighter'
          )}
        >
          {t('optionsCard.template.label').toLocaleUpperCase()}{' '}
          <Icon.GridView className="margin-right-05" style={{ top: '4px' }} />
        </div>

        <div className="padding-x-3 display-flex flex-column height-full">
          <CardBody className="padding-x-0 padding-y-2">
            <Grid row gap={2}>
              <Grid desktop={{ col: 9 }} tablet={{ col: 9 }}>
                <h4 className="line-height-body-4 margin-y-0">
                  {t(`optionsCard.template.header`)}
                </h4>

                {t(`optionsCard.template.description`)}
              </Grid>

              <Grid desktop={{ col: 3 }} tablet={{ col: 3 }}>
                <div className="display-flex flex-justify-end">
                  <Button type="button" outline onClick={() => {}}>
                    {t('optionsCard.template.buttonText')}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </CardBody>
        </div>
      </Card>
    </div>
  );
};

export default MTOOptionsPanel;
