import React from 'react';

import MainContent from 'components/MainContent';

import NotFoundPartial from './NotFoundPartial';

import './index.scss';

const NotFound = ({ errorMessage }: { errorMessage?: string }) => {
  return (
    <MainContent className="mint-not-found grid-container">
      <NotFoundPartial errorMessage={errorMessage} />
    </MainContent>
  );
};

export { NotFoundPartial };
export default NotFound;
