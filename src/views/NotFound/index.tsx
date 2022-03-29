import React from 'react';

import MainContent from 'components/MainContent';

import NotFoundPartial from './NotFoundPartial';

import './index.scss';

const NotFound = () => {
  return (
    <MainContent className="mint-not-found grid-container">
      <NotFoundPartial />
    </MainContent>
  );
};

export { NotFoundPartial };
export default NotFound;
