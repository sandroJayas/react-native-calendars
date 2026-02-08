import XDate from 'xdate';
import React, {useCallback, useMemo} from 'react';
import {View, Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';

export interface Event {
  id?: string;
  start: string;
  end: string;
  title: string;
  summary?: string;
  color?: string;
}

export interface PackedEvent extends Event {
  index: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface EventBlockProps {
  index: number;
  event: PackedEvent;
  onPress: (eventIndex: number) => void;
  renderEvent?: (event: PackedEvent) => JSX.Element;
  format24h?: boolean;
  styles: {[key: string]: ViewStyle | TextStyle};
  testID?: string;
}

const TEXT_LINE_HEIGHT = 17;
const EVENT_DEFAULT_COLOR = '#add8e6';

/** Darken a hex color by a factor (0–1; lower = darker). */
function darkenHex(hex: string, factor: number = 0.9): string {
  const match = hex.replace(/^#/, '').match(/.{2}/g);
  if (!match) return hex;
  const r = Math.round(parseInt(match[0], 16) * factor);
  const g = Math.round(parseInt(match[1], 16) * factor);
  const b = Math.round(parseInt(match[2], 16) * factor);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const EventBlock = (props: EventBlockProps) => {
  const {index, event, renderEvent, onPress, format24h, styles} = props;

  // Fixing the number of lines for the event title makes this calculation easier.
  // However it would make sense to overflow the title to a new line if needed
  const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
  const formatTime = format24h ? 'HH:mm' : 'hh:mm A';
  const eventStyle = useMemo(() => {
    const backgroundColor = event.color ? event.color : EVENT_DEFAULT_COLOR;
    return {
      left: event.left,
      height: event.height,
      width: event.width,
      top: event.top,
      backgroundColor,
      borderColor: darkenHex(backgroundColor)
    };
  }, [event]);

  const _onPress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);

  return (
    <TouchableOpacity testID={props.testID} activeOpacity={0.9} onPress={_onPress} style={[styles.event, eventStyle]}>
      {renderEvent ? (
        renderEvent(event)
      ) : (
        <View>
          <Text numberOfLines={1} style={styles.eventTitle}>
            {event.title || 'Event'}
          </Text>
          {numberOfLines > 1 ? (
            <Text numberOfLines={numberOfLines - 1} style={[styles.eventSummary]}>
              {event.summary || ' '}
            </Text>
          ) : null}
          {numberOfLines > 2 ? (
            <Text style={styles.eventTimes} numberOfLines={1}>
              {new XDate(event.start).toString(formatTime)} - {new XDate(event.end).toString(formatTime)}
            </Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default EventBlock;
