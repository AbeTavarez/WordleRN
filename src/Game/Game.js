import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { colors, CLEAR, ENTER, colorsToEmoji } from '../constants';
import Keyboard from '../Keyboard/Keyboard';
import * as Clipboard from 'expo-clipboard';
import WordList from '../words';
import { styles } from './styles';
import { copyBidirectionalArr, getDayOfTheYear, getDayKey } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NUMBER_OF_TRIES = 6;
const wordOfTheDay = WordList[getDayOfTheYear()];
const dayKey = getDayKey();

const Game = () => {
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
      console.log(' ::: Saving :::', dataString);
      await AsyncStorage.setItem('@game', dataString);
    } catch (e) {
      console.log('Error storing game data to async storage', e);
    }
  };

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
    // handles user pressing on ENTER
    if (key === ENTER) {
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
      Alert.alert('Winner Winner', 'Chicken Dinner!', [
        { text: 'Share', onPress: shareScore }
      ]);
      setGameState('won');
    } else if (checkIfLoss() && gameState !== 'loss') {
      Alert.alert('Oh no, better luck tomorrow!');
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

  const shareScore = () => {
    const textMap = rows
      .map((row, rowsIdx) =>
        row
          .map(
            (cell, cellIdx) => colorsToEmoji[getCellBGColor(rowsIdx, cellIdx)]
          )
          .join('')
      )
      .filter((row) => row)
      .join('\n');
    const shareText = `Wordle \n${textMap} \n#wordle #palabreo`;
    Clipboard.setStringAsync(shareText);
    Alert.alert('Score copied', 'Share it on social media');
  };

  if (!gameDataLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <ScrollView style={styles.map}>
        {rows.map((row, rowIdx) => (
          <View key={`row-${rowIdx}`} style={styles.row}>
            {row.map((cellLetter, cellIdx) => (
              <View
                key={`cell-${cellIdx}-${rowIdx}`}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(rowIdx, cellIdx)
                      ? colors.grey
                      : colors.darkgrey,
                    backgroundColor: getCellBGColor(rowIdx, cellIdx)
                  }
                ]}
              >
                <Text style={styles.cellText}>{cellLetter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

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
