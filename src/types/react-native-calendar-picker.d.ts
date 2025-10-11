declare module 'react-native-calendar-picker' {
  import {Component} from 'react';
  import {StyleProp, TextStyle} from 'react-native';
  import {Moment} from 'moment';

  interface CalendarPickerProps {
    width?: number;
    height?: number;
    startFromMonday?: boolean;
    allowRangeSelection?: boolean;
    selectedStartDate?: Date;
    selectedEndDate?: Date;
    minDate?: Date;
    maxDate?: Date;
    selectedDayColor?: string;
    selectedDayTextColor?: string;
    todayBackgroundColor?: string;
    todayTextStyle?: StyleProp<TextStyle>;
    textStyle?: StyleProp<TextStyle>;
    monthTitleStyle?: StyleProp<TextStyle>;
    yearTitleStyle?: StyleProp<TextStyle>;
    previousTitle?: string;
    nextTitle?: string;
    previousTitleStyle?: StyleProp<TextStyle>;
    nextTitleStyle?: StyleProp<TextStyle>;
    onDateChange?: (date: Moment, type: 'START_DATE' | 'END_DATE') => void;
  }

  export default class CalendarPicker extends Component<CalendarPickerProps> {}
}
