import throttle from 'lodash/throttle';
import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import constants from '../commons/constants';
import Context from '../expandableCalendar/Context';
import { UpdateSources } from '../expandableCalendar/commons';
import InfiniteList from '../infinite-list';
import MonthView, { MonthViewProps } from './MonthView';
import { getMonthStart } from './helpers/presenter';
import useMonthViewPages, { INITIAL_PAGE, NEAR_EDGE_THRESHOLD, PAGES_COUNT } from './useMonthViewPages';

/** Props passed to each month page (omit date and events; page fetches its own events) */
export type MonthViewPageProps = Omit<MonthViewProps, 'events' | 'date'> & {
  practiceColorMap?: Map<string, string>;
};

export interface MonthViewListProps {
  /**
   * General month view props to pass to each month view item.
   * Include practiceColorMap for pull-on-demand events.
   */
  monthViewProps?: MonthViewPageProps;
  /**
   * Component that receives date + monthViewProps and renders the month (e.g. with useMonthEvents).
   */
  MonthPageComponent: React.ComponentType<{ date: string } & MonthViewPageProps>;
}

const MonthViewList = (props: MonthViewListProps) => {
  const { monthViewProps, MonthPageComponent } = props;

  const { date: contextDate, updateSource, setDate } = useContext(Context);

  const shouldFixRTL = useMemo(() => constants.isRTL && (constants.isRN73() || constants.isAndroid), []);
  const listRef = useRef<any>(null);
  const prevDate = useRef(contextDate);

  const { pages, pagesRef, resetPages, resetPagesDebounce, scrollToPageDebounce, shouldResetPages, isOutOfRange } =
    useMonthViewPages({date: contextDate, listRef, shouldFixRTL});

  const scrollToCurrentMonth = useCallback((targetDate: string) => {
    const targetMonthStart = getMonthStart(targetDate);
    const pageIndex = pagesRef.current.indexOf(targetMonthStart);

    if (updateSource !== UpdateSources.LIST_DRAG) {
      if (isOutOfRange(pageIndex)) {
        updateSource === UpdateSources.DAY_PRESS ? resetPages(targetDate) : resetPagesDebounce(targetDate);
      } else {
        scrollToPageDebounce(pageIndex);
      }
    }
    prevDate.current = targetDate;
  }, [updateSource, isOutOfRange, resetPages, resetPagesDebounce, scrollToPageDebounce]);

  const initialOffset = useMemo(() => {
    return shouldFixRTL 
      ? constants.screenWidth * (PAGES_COUNT - INITIAL_PAGE - 1) 
      : constants.screenWidth * INITIAL_PAGE;
  }, [shouldFixRTL]);

  useEffect(() => {
    if (contextDate !== prevDate.current) {
      scrollToCurrentMonth(contextDate);
    }
  }, [contextDate, scrollToCurrentMonth]);

  const onScroll = useCallback(() => {
    if (shouldResetPages.current) {
      resetPagesDebounce.cancel();
    }
  }, [resetPagesDebounce]);

  const onMomentumScrollEnd = useCallback(() => {
    if (shouldResetPages.current) {
      resetPagesDebounce(prevDate.current);
    }
  }, [resetPagesDebounce]);

  const onPageChange = useMemo(
    () => throttle((pageIndex: number) => {
      const newMonthStart = pages[shouldFixRTL ? pageIndex - 1 : pageIndex];
      if (newMonthStart && newMonthStart !== getMonthStart(prevDate.current)) {
        setDate(newMonthStart, UpdateSources.LIST_DRAG);
        prevDate.current = newMonthStart;
      }
    }, 100),
    [pages, shouldFixRTL, setDate]
  );

  useEffect(() => {
    return () => {
      onPageChange.cancel();
    };
  }, [onPageChange]);

  const onReachNearEdge = useCallback(() => {
    shouldResetPages.current = true;
  }, []);

  const renderPage = useCallback(
    (_type: unknown, item: string) => {
      return <MonthPageComponent key={item} date={item} {...monthViewProps} />;
    },
    [monthViewProps, MonthPageComponent]
  );

  // Only pages in extendedState so RecyclerListView does not re-render all pages when events change
  const extendedState = useMemo(
    () => ({ pages }),
    [pages]
  );

  return (
    <InfiniteList
      isHorizontal
      ref={listRef}
      data={pages}
      renderItem={renderPage}
      onPageChange={onPageChange}
      onReachNearEdge={onReachNearEdge}
      onReachNearEdgeThreshold={NEAR_EDGE_THRESHOLD}
      onScroll={onScroll}
      extendedState={extendedState}
      initialOffset={initialOffset}
      renderAheadOffset={2 * constants.screenWidth}
      scrollViewProps={{
        onMomentumScrollEnd
      }}
    />
  );
};

export default React.memo(MonthViewList);
