import { View, Text, Pressable } from 'react-native';
import { keys, ENTER, CLEAR, colors } from '../constants';
import styles, { keyWidth } from './styles.js';
import Animated, { SlideInDown } from 'react-native-reanimated';

const Keyboard = ({
  onKeyPressed = () => {},
  greenCaps = [],
  yellowCaps = [],
  greyCaps = []
}) => {
  const isLongButton = (key) => key === ENTER || key === CLEAR;

  const getKeyBGColor = (key) => {
    if (greenCaps.includes(key)) return colors.primary;
    if (yellowCaps.includes(key)) return colors.secondary;
    if (greyCaps.includes(key)) return colors.darkgrey;
    return colors.grey;
  };

  return (
    <Animated.View
      entering={SlideInDown.duration(1000).springify().mass(0.8)}
      style={styles.keyboard}
    >
      {keys.map((keyRow, idx) => (
        <View style={styles.row} key={`row-${idx}`}>
          {keyRow.map((key) => (
            <Pressable
              onPress={() => onKeyPressed(key)}
              disabled={greyCaps.includes(key)}
              key={key}
              style={[
                styles.key,
                isLongButton(key) ? { width: keyWidth * 1.4 } : {},
                { backgroundColor: getKeyBGColor(key) }
              ]}
            >
              <Text
                style={[
                  styles.keyText,
                  isLongButton(key) ? { fontSize: 12 } : { fontSize: 14 }
                ]}
              >
                {key.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </Animated.View>
  );
};

export default Keyboard;
