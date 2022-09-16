export const colors = {
  black: '#000000',
  darkgrey: '#7A86B6',
  grey: '#513252',
  lightgrey: '#FCF8E8',
  primary: '#59CE8F',
  secondary: '#FFD32D'
};

//object mapping color from colors object to emoji
export const colorsToEmoji = {
  [colors.darkgrey]: '🟥',
  [colors.primary]: '🟩',
  [colors.secondary]: '🟨'
};

// ENTER and CLEAR are 'long buttons'
export const ENTER = 'ENTER';
export const CLEAR = 'CLEAR';

// keys array to represent the keyboard values
// each nested array is a 'keyRow' of the keyboard
export const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  [CLEAR, 'z', 'x', 'c', 'v', 'b', 'n', 'm', ENTER]
];
