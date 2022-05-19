import React, { useEffect, useState } from 'react';

const Expire = ({
  delay,
  children
}: {
  children: React.ReactNode | string;
  delay: number;
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return visible ? <div>{children}</div> : <div />;
};

export default Expire;
