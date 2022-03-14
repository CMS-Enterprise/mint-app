import React from 'react';
import { withRouter } from 'react-router-dom';

import MainContent from 'components/MainContent';

import WelcomeText from './WelcomeText';

import './index.scss';

const Home = () => {
  const renderView = () => {
    return (
      <div className="grid-container">
        <WelcomeText />
      </div>
    );
  };

  return <MainContent className="margin-bottom-5">{renderView()}</MainContent>;
};

export default withRouter(Home);
