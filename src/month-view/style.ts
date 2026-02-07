import { StyleSheet } from 'react-native';
import constants from '../commons/constants';
import * as defaultStyle from '../style';
import { Theme } from '../types';

const LINE_COLOR = '#D8D8D8';
const TIME_LABEL_COLOR = '#AAAAAA';
const EVENT_DOT_COLOR = '#2d4150';
const HEADER_BACKGROUND = '#FFFFFF';
const TODAY_BACKGROUND = '#F0F4FF';
const OUTSIDE_MONTH_COLOR = '#CCCCCC';

export default function styleConstructor(theme: Theme = {}) {
  const appStyle = {...defaultStyle, ...theme};

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyle.calendarBackground,
      ...theme.monthViewContainer
    },
    headerContainer: {
      backgroundColor: HEADER_BACKGROUND,
      paddingVertical: 8,
      ...theme.monthViewHeaderContainer
    },
    monthTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#2d4150',
      textAlign: 'center',
      marginBottom: 8,
      fontFamily: constants.isIOS ? 'Helvetica Neue' : 'Roboto',
      ...theme.monthViewMonthTitle
    },
    weekDaysContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: LINE_COLOR,
      paddingBottom: 8,
      ...theme.monthViewWeekDaysContainer
    },
    weekDayName: {
      flex: 1,
      fontSize: 12,
      fontWeight: '500',
      color: TIME_LABEL_COLOR,
      textAlign: 'center',
      fontFamily: constants.isIOS ? 'Helvetica Neue' : 'Roboto',
      ...theme.monthViewWeekDayName
    },
    gridContainer: {
      flex: 1,
      ...theme.monthViewGridContainer
    },
    weekRow: {
      flexDirection: 'row',
      flex: 1,
      ...theme.monthViewWeekRow
    },
    dayCell: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 4,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: LINE_COLOR,
      minHeight: 50,
      ...theme.monthViewDayCell
    },
    dayCellFirst: {
      borderLeftWidth: 1,
      ...theme.monthViewDayCellFirst
    },
    dayCellToday: {
      backgroundColor: TODAY_BACKGROUND,
      ...theme.monthViewDayCellToday
    },
    dayCellSelected: {
      backgroundColor: appStyle.selectedDayBackgroundColor || '#E6F3FF',
      ...theme.monthViewDayCellSelected
    },
    dayCellOutside: {
      opacity: 0.4,
      ...theme.monthViewDayCellOutside
    },
    dayNumber: {
      fontSize: 14,
      fontWeight: '500',
      color: '#2d4150',
      fontFamily: constants.isIOS ? 'Helvetica Neue' : 'Roboto',
      ...theme.monthViewDayNumber
    },
    dayNumberToday: {
      color: '#FFFFFF',
      backgroundColor: appStyle.selectedDayBackgroundColor || '#00adf5',
      borderRadius: 12,
      width: 24,
      height: 24,
      lineHeight: 24,
      textAlign: 'center',
      overflow: 'hidden',
      ...theme.monthViewDayNumberToday
    },
    dayNumberOutside: {
      color: OUTSIDE_MONTH_COLOR,
      ...theme.monthViewDayNumberOutside
    },
    eventDotsContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      marginTop: 2,
      maxWidth: '100%',
      paddingHorizontal: 2,
      ...theme.monthViewEventDotsContainer
    },
    eventDot: {
      height: 16,
      borderRadius: 6,
      backgroundColor: EVENT_DOT_COLOR,
      marginVertical: 1,
      paddingHorizontal: 4,
      justifyContent: 'center',
      overflow: 'hidden',
      ...theme.monthViewEventDot
    },
    eventDotText: {
      fontSize: 10,
      color: '#FFFFFF',
      fontFamily: constants.isIOS ? 'Helvetica Neue' : 'Roboto',
      ...theme.monthViewEventDotText
    },
    moreEventsText: {
      fontSize: 10,
      color: TIME_LABEL_COLOR,
      marginTop: 1,
      alignSelf: 'flex-start',
      fontFamily: constants.isIOS ? 'Helvetica Neue' : 'Roboto',
      ...theme.monthViewMoreEventsText
    }
  });
}
