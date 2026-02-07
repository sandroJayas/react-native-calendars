import React, { useMemo } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { weekDayNames } from '../dateutils';
import { getMonthTitle } from './helpers/presenter';

export interface MonthViewHeaderProps {
  date?: string;
  firstDayOfWeek: number;
  styles: {[key: string]: ViewStyle | TextStyle};
  testID?: string;
}

const MonthViewHeader = (props: MonthViewHeaderProps) => {
  const { date, firstDayOfWeek, styles, testID } = props;

  // Get localized month names
  const monthTitle = useMemo(() => {
    return getMonthTitle(date || '');
  }, [date]);

  // Get localized day names with correct first day
  const dayNames = useMemo(() => {
    return weekDayNames(firstDayOfWeek);
  }, [firstDayOfWeek]);

  return (
    <View style={styles.headerContainer} testID={testID}>
      <Text style={styles.monthTitle} testID={`${testID}.title`}>
        {monthTitle}
      </Text>
      <View style={styles.weekDaysContainer}>
        {dayNames.map((dayName: string, index: number) => (
          <Text
            key={`dayName-${index}`}
            style={styles.weekDayName}
            testID={`${testID}.dayName.${index}`}
          >
            {dayName}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default React.memo(MonthViewHeader);
