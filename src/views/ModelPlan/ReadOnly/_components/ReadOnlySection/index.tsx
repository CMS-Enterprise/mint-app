import React from 'react';

type ReadOnlySectionProps = {
  className?: string;
  copy?: string;
  heading: string;
  list?: boolean;
  listItems?: string[];
};

const ReadOnlySection = ({
  className,
  copy,
  heading,
  list,
  listItems
}: ReadOnlySectionProps) => {
  const sectionName = heading.toLowerCase().replaceAll(' ', '-');

  return (
    <div
      className={`read-only-section read-only-section--${sectionName} margin-bottom-3 ${
        className ?? ''
      }`}
    >
      <p className="text-bold margin-y-0 font-sans-md line-height-sans-4">
        {heading}
      </p>
      {!list ? (
        <p className="margin-y-0 font-sans-md line-height-sans-4">{copy}</p>
      ) : (
        <ul className="margin-y-0 padding-left-3">
          {listItems!.map(item => (
            <li className="font-sans-md line-height-sans-4">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReadOnlySection;
