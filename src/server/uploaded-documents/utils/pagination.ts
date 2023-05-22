import * as R from 'ramda';

export type PaginationDetails = {
  prevValue: number | null;
  nextValue: number | null;
  titlePostfix: string;
  totalPages: number;
  pageOn: number;

  pagesToShow: number[];
};

function getTrimmedListOfPages(fullList: number[], pageOn: number) {
  const totalPages = fullList.length;
  return R.dropRepeats(
    fullList.reduce<(number | null)[]>((fullList, page) => {
      if (page === 1 || page === totalPages) {
        return [...fullList, page];
      }

      if (Math.abs(page - pageOn) <= 1) {
        return [...fullList, page];
      }

      return [...fullList, null];
    }, []),
  );
}
export function getPaginationDetails(
  pageRequested: number | undefined,
  numberOfResults: number,
  resultsPerPage = 10,
): PaginationDetails {
  const totalPages = Math.ceil(numberOfResults / resultsPerPage) ?? 0;
  const pageOn = pageRequested ? Number(pageRequested) : 1;
  const allPages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const pagesToShow =
    totalPages > 5 ? getTrimmedListOfPages(allPages, pageOn) : allPages;

  return {
    prevValue: pageRequested > 1 ? pageOn - 1 : null,
    nextValue: pageOn < totalPages ? pageOn + 1 : null,
    titlePostfix: totalPages ? ` (page ${pageOn} of ${totalPages})` : '',
    totalPages,
    pageOn,
    pagesToShow,
  };
}
