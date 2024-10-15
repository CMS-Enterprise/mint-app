import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';

type SubmittionFooterProps = {
  homeArea: string;
  homeRoute: string;
  backPage?: string;
  nextPage?: boolean;
};

const SubmittionFooter = ({
  homeArea,
  homeRoute,
  nextPage = true,
  backPage
}: SubmittionFooterProps) => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const history = useHistory();

  return (
    <>
      <div className="margin-top-6 margin-bottom-2 display-flex">
        {backPage && (
          <Button
            type="button"
            className="usa-button usa-button--outline"
            onClick={() => {
              history.push(backPage);
            }}
          >
            {miscellaneousT('back')}
          </Button>
        )}

        {nextPage && <Button type="submit">{miscellaneousT('next')}</Button>}
      </div>

      <Button
        type="button"
        className="usa-button usa-button--unstyled"
        onClick={() => history.push(homeRoute)}
      >
        <Icon.ArrowBack className="margin-right-1" aria-hidden />

        {homeArea}
      </Button>
    </>
  );
};

export default SubmittionFooter;
