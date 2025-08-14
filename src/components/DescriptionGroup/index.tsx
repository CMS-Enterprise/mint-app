import React, { ReactNode, ReactNodeArray } from 'react';
import classnames from 'classnames';

import './index.scss';

type DescriptionListProps = {
  className?: string;
  title: string;
  children: ReactNode | ReactNodeArray;
};
export const DescriptionList = ({
  title,
  children,
  className
}: DescriptionListProps) => (
  <dl className={className} title={title}>
    {children}
  </dl>
);

type DescriptionTermProps = {
  className?: string;
  term: string | string[] | ReactNode;
};

export const DescriptionTerm = ({ className, term }: DescriptionTermProps) => (
  <dt className={classnames('text-bold', 'margin-bottom-05', className)}>
    {term}
  </dt>
);

type DescriptionDefinitionProps = {
  className?: string;
  dataTestId?: string;
  definition?: React.ReactNode;
};

export const DescriptionDefinition = React.forwardRef<
  HTMLElement,
  DescriptionDefinitionProps
  // eslint-disable-next-line react/prop-types
>(({ className, definition, dataTestId }, ref) => (
  <dd
    ref={ref}
    data-testid={dataTestId}
    className={classnames('description-definition', 'margin-0', className)}
  >
    {definition}
  </dd>
));
