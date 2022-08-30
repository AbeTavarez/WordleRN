import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { colors, CLEAR, ENTER, colorsToEmoji } from '../constants';
import Keyboard from '../Keyboard/Keyboard';
import * as Clipboard from 'expo-clipboard';
import WordList from '../words';

const NUMBER_OF_TRIES = 6;

const getDayOfTheYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
};

const wordOfTheDay = WordList[getDayOfTheYear()];

const Game = () => {
  // const word = 'hello';
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

  // Game State
  useEffect(() => {
    if (currRow > 0) {
      checkGameState();
    }
  }, [currRow]);

  const copyBidirectionalArr = (arr) => [...arr.map((row) => [...row])];

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

const styles = StyleSheet.create({
  map: {
    alignSelf: 'stretch',
    marginTop: 20
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  cell: {
    borderColor: colors.grey,
    borderWidth: 3,
    flex: 1,
    aspectRatio: 1,
    margin: 3,
    maxWith: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cellText: {
    color: colors.grey,
    fontWeight: 'bold',
    fontSize: 28
  }
});

export default Game;
