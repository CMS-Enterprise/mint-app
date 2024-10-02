import React from 'react';

const SimpleList = ({ list, heading }: { list: string[]; heading: string }) => {
  return (
    <div className="margin-bottom-3">
      <h3 className="margin-y-0">{heading}</h3>

      <ul className="margin-y-0 padding-top-1">
        {list.map(section => (
          <li key={section}>{section}</li>
        ))}
      </ul>
    </div>
  );
};

export default SimpleList;
