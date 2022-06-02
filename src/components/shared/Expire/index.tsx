import React, { useEffect, useState } from 'react';

const Expire = ({
  delay,
  children,
  callback
}: {
  children: React.ReactNode | string;
  delay: number;
  callback?: (message: string) => void;
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (callback) callback('');
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, callback]);

  return visible ? <div>{children}</div> : <div />;
};

export default Expire;
