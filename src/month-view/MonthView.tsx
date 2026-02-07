import React, { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';

import { getCalendarDateString } from '../services';
import { Event } from '../timeline/EventBlock';
import { Theme } from '../types';
import MonthViewGrid from './MonthViewGrid';
import MonthViewHeader from './MonthViewHeader';
import { getMonthDates, isDayInCurrentMonth } from './helpers/presenter';
import styleConstructor from './style';

export interface MonthViewProps {
  /**
   * The date of the month to display (any date within the month)
   */
  date?: string;
  /**
   * Events grouped by date (YYYY-MM-DD) for this month. Pass grouped map to avoid regrouping.
   */
  events: Record<string, Event[]>;
  /**
   * First day of the week (0 = Sunday, 1 = Monday, etc.)
   */
  firstDayOfWeek?: number;
  /**
   * Handle day press
   */
  onDayPress?: (date: string, events: Event[]) => void;
  /**
   * Handle long press on a day for creating new events
   */
  onDayLongPress?: (date: string) => void;
  /**
   * Specify theme properties to override specific styles
   */
  theme?: Theme;
  /**
   * Whether to show six weeks always (for consistent height)
   */
  showSixWeeks?: boolean;
  /** Identifier for testing */
  testID?: string;
}

const MonthView = (props: MonthViewProps) => {
  const {
    date = '',
    events,
    firstDayOfWeek = 0,
    onDayPress,
    onDayLongPress,
    theme,
    showSixWeeks = true,
    testID
  } = props;

  const styles = useMemo(() => styleConstructor(theme), [theme]);

  // Get all dates for the month grid (including padding days from prev/next months)
  const monthDates = useMemo(() => {
    return getMonthDates(date, firstDayOfWeek, showSixWeeks);
  }, [date, firstDayOfWeek, showSixWeeks]);

  // Get the current month for comparison
  const currentMonthDate = useMemo(() => {
    return date ? date : getCalendarDateString(new Date());
  }, [date]);

  // Check if a date is in the current month
  const isDateInCurrentMonth = useCallback((dateString: string) => {
    return isDayInCurrentMonth(dateString, currentMonthDate);
  }, [currentMonthDate]);

  // Get events for a specific date (events prop is already grouped by date)
  const getEventsForDate = useCallback((dateString: string): Event[] => {
    return events[dateString] ?? [];
  }, [events]);

  const onDayPressRef = useRef(onDayPress);
  onDayPressRef.current = onDayPress;

  // Handle day press (stable callback via ref)
  const _onDayPress = useCallback((dateString: string) => {
    const dayEvents = getEventsForDate(dateString);
    onDayPressRef.current?.(dateString, dayEvents);
  }, [getEventsForDate]);

  return (
    <View style={styles.container} testID={testID}>
      <MonthViewHeader
        date={date}
        firstDayOfWeek={firstDayOfWeek}
        styles={styles}
        testID={`${testID}.header`}
      />
      <MonthViewGrid
        monthDates={monthDates}
        isDateInCurrentMonth={isDateInCurrentMonth}
        getEventsForDate={getEventsForDate}
        onDayPress={_onDayPress}
        onDayLongPress={onDayLongPress}
        styles={styles}
        testID={`${testID}.grid`}
      />
    </View>
  );
};

export { Event as MonthViewEventProps };
export default React.memo(MonthView);
