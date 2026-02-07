import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { getCalendarDateString } from '../services';
import { Event } from '../timeline/EventBlock';

const NUMBER_OF_DAYS_IN_WEEK = 7;
const PILL_HEIGHT = 16;
const PILL_VERTICAL_MARGIN = 1;
const PILL_ROW_HEIGHT = PILL_HEIGHT + PILL_VERTICAL_MARGIN * 2;

export interface DayCellProps {
  dateString: string;
  dayEvents: Event[];
  isToday: boolean;
  isInCurrentMonth: boolean;
  isFirstInRow: boolean;
  isFirstCell: boolean;
  onDayPress: (dateString: string) => void;
  onDayLongPress: (dateString: string) => void;
  onPillAreaLayout?: (event: LayoutChangeEvent) => void;
  styles: Record<string, ViewStyle | TextStyle>;
  testID?: string;
  maxPillRows: number;
}

function DayCellComponent(props: DayCellProps) {
  const {
    dateString,
    dayEvents,
    isToday,
    isInCurrentMonth,
    isFirstInRow,
    isFirstCell,
    onDayPress,
    onDayLongPress,
    onPillAreaLayout,
    styles,
    testID,
    maxPillRows
  } = props;

  const dayNumber = parseInt(dateString.split('-')[2], 10);

  const pillContent = useMemo(() => {
    if (dayEvents.length === 0 || maxPillRows === 0) return null;
    const hasOverflow = dayEvents.length > maxPillRows;
    const visiblePillsCount = hasOverflow ? Math.max(0, maxPillRows - 1) : dayEvents.length;
    const visibleEvents = dayEvents.slice(0, visiblePillsCount);
    return (
      <>
        {visibleEvents.map((event, index) => (
          <View
            key={event.id || `pill-${index}`}
            style={[
              styles.eventDot as ViewStyle,
              event.color ? {backgroundColor: event.color} : undefined
            ]}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.eventDotText as TextStyle}
            >
              {event.title}
            </Text>
          </View>
        ))}
        {hasOverflow && <Text style={styles.moreEventsText as TextStyle}>...</Text>}
      </>
    );
  }, [dayEvents, maxPillRows, styles]);

  return (
    <TouchableOpacity
      style={[
        styles.dayCell as ViewStyle,
        isFirstInRow && (styles.dayCellFirst as ViewStyle),
        isToday && (styles.dayCellToday as ViewStyle),
        !isInCurrentMonth && (styles.dayCellOutside as ViewStyle)
      ]}
      onPress={() => onDayPress(dateString)}
      onLongPress={() => onDayLongPress(dateString)}
      activeOpacity={1}
      testID={testID ? `${testID}.day.${dateString}` : undefined}
    >
      <Text
        style={[
          styles.dayNumber as TextStyle,
          isToday && (styles.dayNumberToday as TextStyle),
          !isInCurrentMonth && (styles.dayNumberOutside as TextStyle)
        ]}
      >
        {dayNumber}
      </Text>
      <View
        style={styles.eventDotsContainer as ViewStyle}
        onLayout={isFirstCell ? onPillAreaLayout : undefined}
      >
        {pillContent}
      </View>
    </TouchableOpacity>
  );
}

const DayCell = React.memo(DayCellComponent, (prev, next) => {
  return (
    prev.dateString === next.dateString &&
    prev.dayEvents === next.dayEvents &&
    prev.isToday === next.isToday &&
    prev.isInCurrentMonth === next.isInCurrentMonth &&
    prev.isFirstInRow === next.isFirstInRow &&
    prev.isFirstCell === next.isFirstCell &&
    prev.maxPillRows === next.maxPillRows &&
    prev.styles === next.styles &&
    prev.testID === next.testID
  );
});

export interface MonthViewGridProps {
  monthDates: string[];
  isDateInCurrentMonth: (date: string) => boolean;
  getEventsForDate: (date: string) => Event[];
  onDayPress?: (date: string) => void;
  onDayLongPress?: (date: string) => void;
  styles: Record<string, ViewStyle | TextStyle>;
  testID?: string;
}

const MonthViewGrid = (props: MonthViewGridProps) => {
  const {
    monthDates,
    isDateInCurrentMonth,
    getEventsForDate,
    onDayPress,
    onDayLongPress,
    styles,
    testID
  } = props;

  // Split dates into weeks (rows of 7 days)
  const weeks = useMemo(() => {
    const result: string[][] = [];
    for (let i = 0; i < monthDates.length; i += NUMBER_OF_DAYS_IN_WEEK) {
      result.push(monthDates.slice(i, i + NUMBER_OF_DAYS_IN_WEEK));
    }
    return result;
  }, [monthDates]);

  const todayStr = useMemo(() => getCalendarDateString(new Date()), []);
  const emptyEvents = useMemo<Event[]>(() => [], []);

  const [pillAreaHeight, setPillAreaHeight] = useState<number | null>(null);

  const handlePillAreaLayout = useCallback((event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout;
    setPillAreaHeight(prevHeight => {
      if (prevHeight === null || Math.abs(prevHeight - height) > 1) {
        return height;
      }
      return prevHeight;
    });
  }, []);

  const maxPillRows = useMemo(() => {
    if (!pillAreaHeight) {
      return 0;
    }
    return Math.floor(pillAreaHeight / PILL_ROW_HEIGHT);
  }, [pillAreaHeight]);

  function renderWeekRow(weekDates: string[], weekIndex: number) {
    return (
      <View
        key={`week-${weekIndex}`}
        style={styles.weekRow as ViewStyle}
        testID={`${testID}.week.${weekIndex}`}
      >
        {weekDates.map((dateString, dayIndex) => {
          const dayEvents = getEventsForDate(dateString);
          const eventsToPass = dayEvents.length === 0 ? emptyEvents : dayEvents;
          return (
            <DayCell
              key={dateString}
              dateString={dateString}
              dayEvents={eventsToPass}
              isToday={dateString === todayStr}
              isInCurrentMonth={isDateInCurrentMonth(dateString)}
              isFirstInRow={dayIndex === 0}
              isFirstCell={weekIndex === 0 && dayIndex === 0}
              onDayPress={dateString => onDayPress?.(dateString)}
              onDayLongPress={dateString => onDayLongPress?.(dateString)}
              onPillAreaLayout={weekIndex === 0 && dayIndex === 0 ? handlePillAreaLayout : undefined}
              styles={styles}
              testID={testID}
              maxPillRows={maxPillRows}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.gridContainer as ViewStyle} testID={testID}>
      {weeks.map((weekDates, weekIndex) => renderWeekRow(weekDates, weekIndex))}
    </View>
  );
};

export default React.memo(MonthViewGrid);
