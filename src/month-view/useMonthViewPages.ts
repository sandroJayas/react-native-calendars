import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import debounce from 'lodash/debounce';
import inRange from 'lodash/inRange';
import constants from '../commons/constants';
import { generateMonthPages } from './helpers/presenter';

export const PAGES_COUNT = 100;
export const NEAR_EDGE_THRESHOLD = 10;
export const INITIAL_PAGE = Math.floor(PAGES_COUNT / 2);

function isOutOfRange(index: number): boolean {
  return !inRange(index, 0, PAGES_COUNT);
}

interface UseMonthViewPagesProps {
  date: string;
  listRef: RefObject<any>;
  shouldFixRTL: boolean;
}

const useMonthViewPages = ({date, listRef, shouldFixRTL}: UseMonthViewPagesProps) => {
  const pagesRef = useRef(generateMonthPages(date, PAGES_COUNT));

  const [pages, setPages] = useState<string[]>(pagesRef.current);
  const shouldResetPages = useRef(false);

  const scrollToPage = useCallback((pageIndex: number) => {
    listRef.current?.scrollToOffset(
      shouldFixRTL 
        ? (PAGES_COUNT - 1 - pageIndex) * constants.screenWidth 
        : pageIndex * constants.screenWidth, 
      0, 
      false
    );
  }, [listRef, shouldFixRTL]);

  const resetPages = useCallback((targetDate: string) => {
    pagesRef.current = generateMonthPages(targetDate, PAGES_COUNT);
    setPages(pagesRef.current);

    setTimeout(() => {
      scrollToPage(INITIAL_PAGE);
      shouldResetPages.current = false;
    }, 0);
  }, [scrollToPage]);

  const resetPagesDebounce = useMemo(
    () => debounce(resetPages, 500, {leading: false, trailing: true}),
    [resetPages]
  );

  const scrollToPageDebounce = useMemo(
    () => debounce(scrollToPage, 250, {leading: false, trailing: true}),
    [scrollToPage]
  );

  useEffect(() => {
    return () => {
      resetPagesDebounce.cancel();
      scrollToPageDebounce.cancel();
    };
  }, [resetPagesDebounce, scrollToPageDebounce]);

  return {
    resetPages,
    resetPagesDebounce,
    scrollToPage,
    scrollToPageDebounce,
    pagesRef,
    pages,
    shouldResetPages,
    isOutOfRange
  };
};

export default useMonthViewPages;
