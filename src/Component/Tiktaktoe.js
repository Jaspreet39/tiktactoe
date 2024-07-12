import React, { useState, useEffect } from "react";
import "../App.css";
import {
  checkWin,
  reset,
  toggle,
  findWinningMove,
  findBlockingMove,
} from "./Contant";

function Tiktaktoe() {
  let initialState = Array(4).fill(Array(16).fill(""));
  let [blocks, setBlocks] = useState(initialState.map((arr) => [...arr]));
  let [count, setCount] = useState(0);
  let [lock, setLock] = useState(false);
  let [win, setWin] = useState("");
  let [isComputer, setIsComputer] = useState(true);

  const won = (winner) => {
    setLock(true);
    setWin(winner);
  };

  useEffect(() => {
    if (isComputer && count % 2 !== 0 && !lock) {
      setTimeout(() => {
        const winningMove = findWinningMove(blocks);
        if (winningMove) {
          const { blockIndex, index } = winningMove;
          toggle(
            null,
            blockIndex,
            index,
            count,
            blocks,
            setCount,
            lock,
            setBlocks,
            true
          );
        } else {
          const blockingMove = findBlockingMove(blocks);
          if (blockingMove) {
            const { blockIndex, index } = blockingMove;
            toggle(
              null,
              blockIndex,
              index,
              count,
              blocks,
              setCount,
              lock,
              setBlocks,
              true
            );
          } else {
            const emptyIndices = blocks.reduce((acc, block, blockIndex) => {
              block.forEach((val, index) => {
                if (val === "") acc.push({ blockIndex, index });
              });
              return acc;
            }, []);
            const randomIndex =
              emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            toggle(
              null,
              randomIndex.blockIndex,
              randomIndex.index,
              count,
              blocks,
              setCount,
              lock,
              setBlocks,
              true
            );
          }
        }
        checkWin(blocks, won);
      }, 500); // Adding a small delay for better user experience
    }
  }, [count, blocks, isComputer, lock]);

  return (
    <div className="app">
      <div className="app_players">
        <h1>Player X</h1>
        <h1>Player O</h1>
        <button
          className="myAction"
          onClick={() => reset(lock, setLock, setBlocks, setCount, setWin)}
        >
          reset
        </button>
        <button className="myAction" onClick={() => setIsComputer(!isComputer)}>
          {isComputer ? "Play with Human" : "Play with Computer"}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {blocks.map((block, blockIndex) => (
          <div key={blockIndex} className="main_Block">
            {block.map((item, i) => (
              <div
                key={i}
                onClick={(e) => {
                  if (
                    !lock &&
                    !blocks[blockIndex][i] &&
                    (count % 2 === 0 || !isComputer)
                  ) {
                    toggle(
                      e,
                      blockIndex,
                      i,
                      count,
                      blocks,
                      setCount,
                      lock,
                      setBlocks,
                      false
                    );
                    checkWin(blocks, won);
                  }
                }}
                className="block"
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
      {lock ? (
        <div className="app_win">
          <h1>{`Congratulations ${win} has won the round`}</h1>
        </div>
      ) : (
        <div className="app_win">
          <h1>Guess who will win the round</h1>
        </div>
      )}
    </div>
  );
}

export default Tiktaktoe;
