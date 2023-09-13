import React from 'react';
import { useTranslation } from 'react-i18next';

const Replies = () => {
  const { t: discussionsT } = useTranslation('discussions');

  return (
    <>
      <p className="margin-y-0">
        {discussionsT('replies', { count: 0, context: '0' })}
      </p>
      <p className="margin-y-0">{discussionsT('replies', { count: 1 })}</p>
      <p className="margin-y-0">{discussionsT('replies', { count: 2 })}</p>
    </>
  );
};

export default Replies;
