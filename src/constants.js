export const colors = {
  black: '#100F0F',
  darkgrey: '#413F42',
  grey: '#7F8487',
  lightgrey: '#F1EEE9',
  primary: '#59CE8F',
  secondary: '#FFEE63'
};

//object mapping color from colors object to emoji
export const colorsToEmoji = {
  [colors.darkgrey]: '🔴',
  [colors.primary]: '🟢',
  [colors.secondary]: '🟡'
};

// ENTER and CLEAR are 'long buttons'
export const ENTER = 'ENTER';
export const CLEAR = 'CLEAR';

// keys array to represent the keyboard values
// each nested array is a 'keyRow' of the keyboard
export const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  [ENTER, 'z', 'x', 'c', 'v', 'b', 'n', 'm', CLEAR]
];
