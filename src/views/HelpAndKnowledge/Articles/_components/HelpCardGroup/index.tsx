import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { CardGroup } from '@trussworks/react-uswds';

import ArticleCard from 'views/HelpAndKnowledge/Articles/_components/ArticleCard';

import helpAndKnowledgeArticles from '../..';

type HelpCardGroupType = {
  className?: string;
  filter?: string | null;
  showFirstThree?: boolean;
  tag?: boolean;
  pagination?: boolean;
};

const HelpCardGroup = ({
  className,
  filter,
  showFirstThree,
  tag,
  pagination = false
}: HelpCardGroupType) => {
  const [pageOffset, setPageOffset] = useState(0);

  helpAndKnowledgeArticles.sort((a, b) => a.order - b.order);

  const articles = filter
    ? helpAndKnowledgeArticles.filter(article => article.type === filter)
    : helpAndKnowledgeArticles;

  // Pagination configurations
  const itemsPerPage = 9;
  const endOffset = pageOffset + itemsPerPage;
  const currentItems = articles.slice(pageOffset, endOffset);
  const pageCount = Math.ceil(articles.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % articles.length;
    setPageOffset(newOffset);
  };

  const firstThreeArticles = showFirstThree
    ? currentItems.slice(0, 3)
    : currentItems;

  return (
    <>
      <CardGroup className={className}>
        {firstThreeArticles.map(article => (
          <ArticleCard {...article} isLink tag={tag} type={article.type} />
        ))}
      </CardGroup>

      {pagination && pageCount > 1 && (
        <ReactPaginate
          breakLabel="..."
          breakClassName="usa-pagination__item usa-pagination__overflow"
          nextLabel="Next >"
          containerClassName="mint-pagination usa-pagination usa-pagination__list"
          previousLinkClassName={
            pageOffset === 0
              ? 'display-none'
              : 'usa-pagination__link usa-pagination__previous-page prev-page'
          }
          nextLinkClassName={
            pageOffset / itemsPerPage === pageCount - 1
              ? 'display-none'
              : 'usa-pagination__link usa-pagination__previous-page next-page'
          }
          disabledClassName="pagination__link--disabled"
          activeClassName="usa-current"
          activeLinkClassName="usa-current"
          pageClassName="usa-pagination__item"
          pageLinkClassName="usa-pagination__button"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< Previous"
        />
      )}
    </>
  );
};

export default HelpCardGroup;
