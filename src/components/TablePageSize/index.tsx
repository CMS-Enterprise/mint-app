import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '@trussworks/react-uswds';
import classnames from 'classnames';

type TablePageSizeProps = {
  className?: string;
  pageSize: number | 'all';
  setPageSize: (pageSize: number) => void;
  valueArray?: (number | 'all')[];
  suffix?: string;
};

const Option = ({
  value,
  suffix
}: {
  value: number | 'all';
  suffix?: string; // Add word to end of page - ex: Show 10 milestones
}) => {
  const { t } = useTranslation('systemProfile');
  return (
    <option value={value === 'all' ? 100000 : value}>
      {t('tableAndPagination:pageSize:show', { value })} {suffix}
    </option>
  );
};

const TablePageSize = ({
  className,
  pageSize,
  setPageSize,
  valueArray = [5, 10, 25, 50, 100],
  suffix
}: TablePageSizeProps) => {
  const classNames = classnames('desktop:margin-top-2', className);
  return (
    <div className={classNames}>
      <Select
        className="margin-top-0 width-auto"
        id="table-page-size"
        data-testid="table-page-size"
        name="tablePageSize"
        onChange={(e: any) => {
          setPageSize(e.target.value);
        }}
        value={pageSize}
      >
        {valueArray.map(value => (
          <Option
            key={`table-page-size--${value}`}
            value={value}
            suffix={suffix}
          />
        ))}
      </Select>
    </div>
  );
};

export default TablePageSize;
