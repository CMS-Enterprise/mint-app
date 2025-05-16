import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { UsePaginationInstanceProps, UsePaginationState } from 'react-table';
import classnames from 'classnames';

import getVisiblePages from './util';

import './index.scss';

type ReactTablePaginationProps = {
  className?: string;
  setQueryParam?: boolean;
} & UsePaginationInstanceProps<{}> &
  UsePaginationState<{}>;

const TablePagination = ({
  className,
  gotoPage,
  previousPage,
  nextPage,
  canNextPage,
  pageIndex,
  pageOptions,
  canPreviousPage,
  setQueryParam
}: ReactTablePaginationProps) => {
  const { t } = useTranslation('systemProfile');

  const history = useHistory();

  const params = new URLSearchParams(history.location.search);

  const classNames = classnames(
    'usa-pagination',
    'padding-bottom-1',
    className
  );

  return (
    <nav
      aria-label="Pagination"
      className={classNames}
      data-testid="table-pagination"
    >
      <ul className="usa-pagination__list">
        {canPreviousPage && (
          <li className="usa-pagination__item usa-pagination__arrow">
            <button
              type="button"
              className="usa-pagination__link usa-pagination__previous-page"
              aria-label="Previous page"
              onClick={() => {
                if (setQueryParam) {
                  params.set('page', pageIndex.toString());
                  history.replace({
                    search: params.toString()
                  });
                }
                previousPage();
              }}
              disabled={!canPreviousPage}
            >
              <span className="usa-pagination__link-text">
                {'< '}
                {t('tableAndPagination:pagination.previous')}{' '}
              </span>
            </button>
          </li>
        )}
        <li className="usa-pagination__item usa-pagination__page-no">
          {getVisiblePages(pageIndex + 1, pageOptions.length).map(
            (page, index, array) => {
              return (
                <div key={page}>
                  {array[index - 1] + 1 < page ? (
                    <div className="display-inline-flex">
                      <div
                        className="usa-pagination__item usa-pagination__overflow"
                        role="presentation"
                      >
                        <span> … </span>
                      </div>
                      <div className="usa-pagination__item">
                        <button
                          type="button"
                          aria-label={`Page ${page}`}
                          key={page}
                          className={
                            pageIndex + 1 === page
                              ? 'usa-pagination__button usa-current'
                              : 'usa-pagination__button'
                          }
                          onClick={() => {
                            if (setQueryParam) {
                              params.set('page', page.toString());
                              history.replace({
                                search: params.toString()
                              });
                            }
                            gotoPage(page - 1);
                          }}
                        >
                          {page}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="usa-pagination__item">
                      <button
                        type="button"
                        aria-label={`Page ${page}`}
                        key={page}
                        className={
                          pageIndex + 1 === page
                            ? 'usa-pagination__button usa-current'
                            : 'usa-pagination__button'
                        }
                        onClick={() => {
                          if (setQueryParam) {
                            params.set('page', page.toString());
                            history.replace({
                              search: params.toString()
                            });
                          }
                          gotoPage(page - 1);
                        }}
                      >
                        {page}
                      </button>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </li>
        {canNextPage && (
          <li className="usa-pagination__item usa-pagination__arrow">
            <button
              type="button"
              className="usa-pagination__link usa-pagination__previous-page"
              aria-label="Next page"
              onClick={() => {
                if (setQueryParam) {
                  params.set('page', (pageIndex + 2).toString());
                  history.replace({
                    search: params.toString()
                  });
                }
                nextPage();
              }}
              disabled={!canNextPage}
            >
              <span className="usa-pagination__link-text">
                {t('tableAndPagination:pagination.next')}
                {' >'}
              </span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default TablePagination;
