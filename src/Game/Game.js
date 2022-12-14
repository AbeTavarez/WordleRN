import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { colors, CLEAR, ENTER, colorsToEmoji } from '../constants';
import Keyboard from '../Keyboard/Keyboard';
import * as Clipboard from 'expo-clipboard';
import WordList from '../words';
import { styles } from './styles';
import { copyBidirectionalArr, getDayOfTheYear, getDayKey } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EndScreen from '../EndScreen';
import Animated, {
  SlideInLeft,
  ZoomIn,
  FlipInEasyY,
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';

const NUMBER_OF_TRIES = 6;
const wordOfTheDay = WordList[getDayOfTheYear()];
const dayKey = getDayKey();

const Game = () => {
  // console.log(Dimensions.get('window').height);
  // AsyncStorage.removeItem('@game');
  const letters = wordOfTheDay.split('');

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
  );

  //* Rows are the nested arrays and Columns are the values in the nested array.
  //* [
  //*   ['col1', 'col2'], //row1
  //*   ['col1', 'col2'], //row2
  //* ]
  const [currRow, setCurrRow] = useState(0); // start at first row
  const [currCol, setCurrCol] = useState(0); // start at first column
  const [gameState, setGameState] = useState('playing'); // playing, won, loss
  const [gameDataLoaded, setGameDataLoaded] = useState(false);

  // Game State
  useEffect(() => {
    if (currRow > 0) {
      checkGameState();
    }
  }, [currRow]);

  // Async data storage
  useEffect(() => {
    // run func when any of the dependencies changed
    if (gameDataLoaded) {
      persistState();
    }
  }, [rows, currCol, currCol, gameState]);

  useEffect(() => {
    readState();
  }, []);

  // ===== PERSIST STATE
  const persistState = async () => {
    const todaysData = {
      rows,
      currRow,
      currCol,
      gameState
    };
    try {
      // reads game state data if exists
      const existingString = await AsyncStorage.getItem('@game');
      const existingState = existingString ? JSON.parse(existingString) : {};
      // updates game state data
      existingState[dayKey] = todaysData;
      // writes game state data to async storage
      const dataString = JSON.stringify(existingState);
      // console.log(' ::: Saving :::', dataString);
      await AsyncStorage.setItem('@game', dataString);
    } catch (e) {
      console.log('Error storing game data to async storage', e);
    }
  };

  // ===== READ STATE
  const readState = async () => {
    const dataString = await AsyncStorage.getItem('@game');
    try {
      const data = JSON.parse(dataString);
      const day = data[dayKey]; // access todays data from obj
      setRows(day.rows);
      setCurrRow(day.currRow);
      setCurrCol(day.currCol);
      setGameState(day.gameState);
    } catch (e) {
      console.log("Couldn't parse the state data from async storage", e);
    }
    setGameDataLoaded(true);
  };

  // ===== ON KEYPRESS
  const onKeyPressed = (key) => {
    if (gameState !== 'playing') return;
    // console.warn(key);
    const updatedRows = copyBidirectionalArr(rows);

    // handles user pressing on CLEAR
    if (key === CLEAR) {
      const prevCol = currCol - 1;
      if (prevCol >= 0) {
        updatedRows[currRow][prevCol] = '';
        setRows(updatedRows);
        setCurrCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      // if (currCol === rows[0].length) {
      // WordList.includes(rows[currRow].join('')) === false
      // Alert.alert('This word not in our word bank ???');
      //TODO trigger animation
      // zeroDeg.value = 0;
      // oneDeg.value = 1;
      // negDeg.value = -1;
      // return;
      // }

      if (currCol === rows[0].length) {
        setCurrRow(currRow + 1);
        setCurrCol(0);
      }
      return;
    }

    // handles user pressing on letters
    if (currCol < rows[0].length) {
      updatedRows[currRow][currCol] = key;
      setRows(updatedRows);
      setCurrCol(currCol + 1);
    }
  };

  // Shake Row Animation
  const zeroDeg = useSharedValue(0);
  const oneDeg = useSharedValue(0);
  const negDeg = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      0: {
        transform: [{ translateX: zeroDeg.value }]
      },
      10: {
        transform: [{ translateX: negDeg.value }]
      },
      20: {
        transform: [{ translateX: oneDeg.value }]
      },
      30: {
        transform: [{ translateX: zeroDeg.value }]
      },
      40: {
        transform: [{ translateX: oneDeg.value }]
      },
      50: {
        transform: [{ translateX: negDeg.value }]
      },
      60: {
        transform: [{ translateX: zeroDeg.value }]
      },
      70: {
        transform: [{ translateX: negDeg.value }]
      },
      80: {
        transform: [{ translateX: oneDeg.value }]
      },
      90: {
        transform: [{ translateX: zeroDeg.value }]
      },
      100: {
        transform: [{ translateX: negDeg.value }]
      }
    };
  });

  const isCellActive = (row, col) => row === currRow && col === currCol;

  const getCellBGColor = (rowIdx, colIdx) => {
    const cellLetter = rows[rowIdx][colIdx];
    if (rowIdx >= currRow) {
      return colors.black;
    }
    if (cellLetter === letters[colIdx]) {
      return colors.primary;
    }
    if (letters.includes(cellLetter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  // Cell Colors
  const getAllColorLetters = (color) => {
    return rows.flatMap((row, rowIdx) =>
      row.filter((cell, cellIdx) => getCellBGColor(rowIdx, cellIdx) === color)
    );
  };
  const greenCaps = getAllColorLetters(colors.primary);
  const yellowCaps = getAllColorLetters(colors.secondary);
  const greyCaps = getAllColorLetters(colors.darkgrey);

  //* ===== Game State Functions
  const checkGameState = () => {
    if (checkIfWon() && gameState !== 'won') {
      setGameState('won');
    } else if (checkIfLoss() && gameState !== 'loss') {
      setGameState('loss');
    }
  };

  const checkIfWon = () => {
    // get the previous row to check
    const prevRow = rows[currRow - 1];
    // if every letter in prevRow is in the same index as letters array then is true
    return prevRow.every((letter, i) => letter === letters[i]);
  };

  const checkIfLoss = () => !checkIfWon() && currRow === rows.length;

  const getCellStyles = (rowIdx, cellIdx) => [
    styles.cell,
    {
      borderColor: isCellActive(rowIdx, cellIdx)
        ? colors.grey
        : colors.darkgrey,
      backgroundColor: getCellBGColor(rowIdx, cellIdx)
    }
  ];

  if (!gameDataLoaded) return <ActivityIndicator />;

  if (gameState !== 'playing') {
    // console.log(gameState);
    return (
      <EndScreen
        won={gameState === 'won'}
        rows={rows}
        getCellBGColor={getCellBGColor}
      />
    );
  }

  return (
    <>
      <View style={styles.map}>
        {rows.map((row, rowIdx) => (
          <Animated.View
            entering={SlideInLeft.delay(rowIdx * 150)}
            key={`row-${rowIdx}`}
            style={styles.row}
          >
            {row.map((cellLetter, cellIdx) => (
              <>
                {rowIdx < currRow && (
                  <Animated.View
                    entering={FlipInEasyY.delay(cellIdx * 100)}
                    key={`cell-color-${cellIdx}-${rowIdx}`}
                    style={getCellStyles(rowIdx, cellIdx)}
                  >
                    <Text style={styles.cellText}>
                      {cellLetter.toUpperCase()}
                    </Text>
                  </Animated.View>
                )}
                {rowIdx === currRow && !!cellLetter && (
                  <Animated.View
                    entering={ZoomIn}
                    key={`cell-active-${cellIdx}-${rowIdx}`}
                    style={getCellStyles(rowIdx, cellIdx)}
                  >
                    <Text style={styles.cellText}>
                      {cellLetter.toUpperCase()}
                    </Text>
                  </Animated.View>
                )}
                {!cellLetter && (
                  <View
                    key={`cell-${cellIdx}-${rowIdx}`}
                    style={getCellStyles(rowIdx, cellIdx)}
                  >
                    <Text style={styles.cellText}>
                      {cellLetter.toUpperCase()}
                    </Text>
                  </View>
                )}
              </>
            ))}
          </Animated.View>
        ))}
      </View>

      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </>
  );
};

export default Game;
