import React, { useState, useEffect } from 'react';
import './App.css';
import BaseGame from './modes/base/game';
import ExtendedBaseGame from './modes/extended-base/game';
import FourIslands from './modes/four-islands/game';
import BarbarianTracker from './components/BarbarianTracker';
import DiceDisplay from './components/DiceDisplay';
import DiceStats from './components/DiceStats';

function App() {
  const [gameMode, setGameMode] = useState('base');
  const [twoTwelve, setTwoTwelve] = useState(false);
  const [isCitiesAndKnights, setIsCitiesAndKnights] = useState(false);
  const [barbarianPosition, setBarbarianPosition] = useState(0);
  const [diceRolls, setDiceRolls] = useState([
    { number: 2, value: 0 },
    { number: 3, value: 0 },
    { number: 4, value: 0 },
    { number: 5, value: 0 },
    { number: 6, value: 0 },
    { number: 7, value: 0 },
    { number: 8, value: 0 },
    { number: 9, value: 0 },
    { number: 10, value: 0 },
    { number: 11, value: 0 },
    { number: 12, value: 0 },
  ]);
  const [eventRolls, setEventRolls] = useState([
    { side: "pirate", value: 0 },
    { side: "blue", value: 0 },
    { side: "green", value: 0 },
    { side: "yellow", value: 0 }
  ])
  const [showGraph, setShowGraph] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);
  const [eventDieResult, setEventDieResult] = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      e.preventDefault();

      // Key: 1
      if (e.keyCode === 49) {
        setGameMode('base');
      }

      // Key: 2
      if (e.keyCode === 50) {
        setGameMode('extendedBase');
      }

      // Key: 3
      if (e.keyCode === 51) {
        setGameMode('fourIslands')
      }

      // Key: T
      if (e.keyCode === 84) {
        setTwoTwelve(!twoTwelve);
      }

      // Key: V
      if (e.keyCode === 86) {
        setIsCitiesAndKnights(!isCitiesAndKnights);
      }

      // Key: S
      if (e.keyCode === 83) {
        setShowGraph(!showGraph);
      }

      //Key: D
      if (e.keyCode === 68) {
        handleDiceRoll(); // Update the dice rolls count
      }
    }

    document.addEventListener('keydown', handleKeyDown, false);

    return () => document.removeEventListener('keydown', handleKeyDown, false);
  }, [twoTwelve, isCitiesAndKnights, showGraph]);

  const handleDiceRoll = () => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const roll = dice1 + dice2;
    const eventDie = ['pirate', 'pirate', 'pirate', 'green', 'blue', 'yellow'][Math.floor(Math.random() * 6)];
    if (isCitiesAndKnights) {
      setEventDieResult(eventDie); // Set event die result
      setEventRolls(prevRolls =>
        prevRolls.map(eventRoll => {
          if (eventRoll.side === eventDie) {
            return { ...eventRoll, value: eventRoll.value + 1 };
          }
          return eventRoll;
        })
      );
    }
    if (eventDie === 'pirate' && isCitiesAndKnights) {
      setBarbarianPosition(prevPosition => {
        if (prevPosition + 1 >= 7) { // Assuming 7 is the max position before reset
          setTimeout(() => {
            setBarbarianPosition(0); // Reset after 3 seconds
          }, 1000);
          return 7; // Return the max position and wait before resetting
        } else {
          return prevPosition + 1;
        }
      });
    }
    setLastRoll({ dice1, dice2, sum: roll }); // Store the result to display
    setDiceRolls(prevRolls =>
      prevRolls.map(diceRoll => {
        // If twoTwelve is true and the roll is 2 or 12, increase both 2 and 12
        if (twoTwelve && (roll === 2 || roll === 12)) {
          if (diceRoll.number === 2 || diceRoll.number === 12) {
            return { ...diceRoll, value: diceRoll.value + 1 };
          }
        } else if (diceRoll.number === roll) {
          // If twoTwelve is not true, or the roll is not 2 or 12, proceed as before
          return { ...diceRoll, value: diceRoll.value + 1 };
        }
        return diceRoll;
      })
    );
  };



  return (
    <div className="App">
      {gameMode === 'base' && <BaseGame twoTwelve={twoTwelve} />}
      {gameMode === 'extendedBase' && <ExtendedBaseGame twoTwelve={twoTwelve} />}
      {gameMode === 'fourIslands' && <FourIslands twoTwelve={twoTwelve} />}
      {isCitiesAndKnights && <BarbarianTracker position={barbarianPosition} />}
      {lastRoll && <DiceDisplay diceRollResult={lastRoll} eventDieResult={eventDieResult} isCitiesAndKnights={isCitiesAndKnights} />}
      {showGraph && <div className="graph-container"><DiceStats numberStats={diceRolls} eventStats={eventRolls} isCitiesAndKnights={isCitiesAndKnights} /></div>}
    </div>
  );
}

export default App;
