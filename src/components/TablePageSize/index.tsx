import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '@trussworks/react-uswds';
import classnames from 'classnames';

type TablePageSizeProps = {
  className?: string;
  pageSize: number | 'all';
  setPageSize: (pageSize: number) => void;
  valueArray?: (number | 'all')[];
};

const Option = ({ value }: { value: number | 'all' }) => {
  const { t } = useTranslation('systemProfile');
  return (
    <option value={value}>
      {t('tableAndPagination:pageSize:show', { value })}
    </option>
  );
};

const TablePageSize = ({
  className,
  pageSize,
  setPageSize,
  valueArray = [5, 10, 25, 50, 100]
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
          <Option value={value} />
        ))}
      </Select>
    </div>
  );
};

export default TablePageSize;
