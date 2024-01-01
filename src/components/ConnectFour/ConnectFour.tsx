"use client";

import Image from "next/image";
import React, { useImperativeHandle, useMemo, useRef, useState } from "react";
import classes from "./connect-four.module.scss";

const moveStack: { rowIdx: number; colIdx: number }[] = [];
const winners = {
  A: 0,
  B: 0,
};

const Circle = ({
  onClick,
  value = "",
}: {
  onClick: () => void;
  value: "" | "A" | "B";
}) => {
  const boyAvatar = (
    <div style={{ display: "flex", position: "absolute", top: 3 }}>
      <Image alt={"avatar01"} src={"/avatar01.svg"} width={22} height={27} />
    </div>
  );

  const girlAvatar = (
    <div style={{ display: "flex", position: "absolute", top: 1 }}>
      <Image alt={"avatar02"} src={"/avatar02.svg"} width={25} height={29} />
    </div>
  );
  return (
    <div
      onClick={onClick}
      style={{
        borderColor: value === "A" ? "#37AC5D" : "#F8D145",
        background: value ? (value === "A" ? "#DCF6E4" : "#F7EFD5") : "white",
      }}
      className={`${classes.circle} ${
        value ? classes.borderWidth : classes.borderWidth0
      }`}
    >
      {value ? (value === "A" ? boyAvatar : girlAvatar) : ""}
    </div>
  );
};

interface BoardProps {
  isA: boolean;
  setA: React.Dispatch<React.SetStateAction<boolean>>;
  ref: any;
  gameCountRef: React.MutableRefObject<number>;
  onWin: () => void;
}

const Board: React.FC<BoardProps> = React.forwardRef<any, BoardProps>(
  ({ isA, setA, gameCountRef, onWin }, ref) => {
    const [board, setBoard] = useState([...Array(6)].map(() => [...Array(7)]));
    const winner = useMemo(() => {
      let winner;
      board.find((_, i) => {
        winner = board[i].find((val: string, j: number) => {
          if (val) {
            // top
            let m;
            if (i - 4 + 1 >= 0) {
              m = 0;
              for (; m < 3; m++) {
                if (board[i - m][j] !== board[i - m - 1][j]) {
                  break;
                }
              }
              if (m === 3) {
                return true;
              }
            }

            // top-right
            if (i - 4 + 1 >= 0 && j + 4 - 1 < board[0].length) {
              m = 0;
              for (; m < 3; m++) {
                if (board[i - m][j + m] !== board[i - m - 1][j + m + 1]) {
                  break;
                }
              }
              if (m === 3) {
                return true;
              }
            }

            // right
            if (j + 4 - 1 < board[0].length) {
              m = 0;
              for (; m < 3; m++) {
                if (board[i][j + m] !== board[i][j + m + 1]) {
                  break;
                }
              }
              if (m === 3) {
                return true;
              }
            }

            // bottom-right
            if (i + 4 - 1 < board.length && j + 4 - 1 < board[0].length) {
              m = 0;
              for (; m < 3; m++) {
                if (board[i + m][j + m] !== board[i + m + 1][j + m + 1]) {
                  break;
                }
              }
              if (m === 3) {
                return true;
              }
            }

            // bottom
            if (i + 4 - 1 < board.length) {
              m = 0;
              for (; m < 3; m++) {
                if (board[i + m][j] !== board[i + m + 1][j]) {
                  break;
                }
              }
              if (m === 3) {
                return true;
              }
            }

            // bottom-left
            if (i + 4 - 1 < board.length && j - 4 + 1 >= 0) {
              m = 0;
              for (; m < 3; m++) {
                if (board[i + m][j - m] !== board[i + m + 1][j - m - 1]) {
                  break;
                }
              }
              if (m === 3) {
                return true;
              }
            }

            // left
            if (j - 4 + 1 >= 0) {
              m = 0;
              for (; m < 3; m++) {
                if (board[i][j - m] !== board[i][j - m - 1]) {
                  break;
                }
              }
              if (m === 3) {
                return true;
              }
            }

            // top-left
            if (i - 4 + 1 >= 0 && j - 4 + 1 >= 0) {
              m = 0;
              for (; m < 3; m++) {
                if (board[i - m][j - m] !== board[i - m - 1][j - m - 1]) {
                  break;
                }
              }
              if (m === 3) {
                return true;
              }
            }
          }
        });
        return winner;
      });
      if (winner && winner !== isA) {
        winners[`${winner}`]++;
        gameCountRef.current++;
        setA(winner);
        onWin();
      }
      return winner;
    }, [board, gameCountRef, isA, setA]);

    const updateBoard = (
      rowIdx: number,
      colIdx: number,
      value: undefined | "A" | "B"
    ) => {
      setBoard((prev) => {
        prev[rowIdx][colIdx] = value;
        return prev;
      });
      setA((prev) => !prev);
      value && moveStack.push({ rowIdx, colIdx });
    };

    const undo = () => {
      if (!moveStack[moveStack.length - 1] || winner) {
        return;
      }
      const { rowIdx, colIdx } = moveStack[moveStack.length - 1];
      updateBoard(rowIdx, colIdx, undefined);
      moveStack.pop();
    };

    const handleClick = (colIdx: number) => {
      let row = -1;
      // find lowest empty cell in column colIdx
      board.find((_, i) => {
        if (!board[board.length - i - 1][colIdx]) {
          row = board.length - i - 1;
          return true;
        }
      });

      if (row !== -1) {
        updateBoard(row, colIdx, isA ? "A" : "B");
      }
    };

    useImperativeHandle(ref, () => ({
      undo,
      winner: winner ? !isA : undefined,
    }));

    return (
      <div className={classes.board}>
        {board.map((_, i) => {
          return (
            <div className={classes.circleWrapper} key={i}>
              {board[i].map((_, j) => (
                <Circle
                  value={board[i][j]}
                  onClick={winner ? () => {} : () => handleClick(j)}
                  key={j}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }
);

Board.displayName = "Board";

const PlayerInfo = ({
  player = 1,
  selected = false,
  playerName,
}: {
  player: 1 | 2;
  selected?: boolean;
  playerName: string;
}) => {
  const boyAvatar = (
    <div style={{ display: "flex", position: "absolute", top: 3, left: 7 }}>
      <Image alt={"avatar01"} src={"/avatar01.svg"} width={37} height={49} />
    </div>
  );

  const girlAvatar = (
    <div style={{ display: "flex", position: "absolute", top: 2, left: 4 }}>
      <Image alt={"avatar02"} src={"/avatar02.svg"} width={43} height={48} />
    </div>
  );
  return (
    <div
      style={{
        border: `1px solid ${player === 1 ? "#CCE2D3" : "#E2DCC7"}`,
        background: player === 1 ? "#DCF6E4" : "#F7EFD5",
      }}
      className={classes.playerInfo}
    >
      <div
        style={{
          borderWidth: selected ? 10 : 0,
          margin: selected ? -10 : 0,
        }}
        className={classes.selectedCircle}
      >
        <div
          style={{
            border: "10px solid " + (player === 1 ? "#37AC5D" : "#F8D145"),
          }}
          className={classes.avatarWrapper}
        >
          {player === 1 ? boyAvatar : girlAvatar}
        </div>
      </div>
      <div className={classes.playerInfoRightSec}>
        <div className={classes.textAlignCenter}>
          <div className={classes.playerInfoHeading}>Player 0{player}</div>
          <div className={classes.value}>{playerName}</div>
        </div>
        <div className={classes.textAlignCenter}>
          <div className={classes.playerInfoHeading}>Score</div>
          <div className={classes.value}>
            {player === 1 ? winners.A : winners.B}
          </div>
        </div>
      </div>
    </div>
  );
};

const GameInfo = ({
  isA,
  undo,
  winner,
  gameNo,
  end,
  players,
}: {
  isA: boolean;
  undo: undefined | (() => void);
  winner?: "A" | "B";
  gameNo: number;
  end: () => void;
  players: {
    player1: string;
    player2: string;
  };
}) => {
  return (
    <div className={classes.gameInfo}>
      <div className={classes.topSection}>
        <div>
          <div className={classes.heading}>3 Games Tournament</div>
          {winner && <div className={classes.congrats}>Congratulations!</div>}
          {gameNo < 4 && (
            <div className={classes.gameNo}>Playing Game {gameNo}</div>
          )}
        </div>
        <PlayerInfo playerName={players.player1} player={1} selected={isA} />
        <PlayerInfo playerName={players.player2} player={2} selected={!isA} />
        <hr className={classes.hr}></hr>
      </div>
      <div className={classes.bottomSection}>
        <button className={classes.undoBtn} onClick={undo ?? (() => {})}>
          Undo Step
        </button>
        <button className={classes.endBtn} onClick={end}>
          End Tournament
        </button>
      </div>
    </div>
  );
};

const GameScreen = ({
  players,
}: {
  players: {
    player1: string;
    player2: string;
  };
}) => {
  const [isA, setA] = useState(true);
  const [loading, setLoading] = useState(false);
  const ref = useRef<{ undo: () => void; winner: "A" | "B" }>();
  const gameCountRef = useRef(1);

  const onWin = () => {
    if (gameCountRef.current < 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const resetGame = () => {
    gameCountRef.current = 1;
    winners.A = 0;
    winners.B = 0;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div
      style={{
        background: loading ? "black" : "white",
      }}
      className={classes.connectFour}
    >
      {loading ? (
        <div className={classes.loadingText}>
          {`loading game ${gameCountRef.current}...`}
        </div>
      ) : (
        <>
          <Board
            ref={ref}
            isA={isA}
            setA={setA}
            gameCountRef={gameCountRef}
            onWin={onWin}
          />
          <GameInfo
            undo={ref.current?.undo}
            isA={isA}
            winner={ref.current?.winner}
            gameNo={gameCountRef.current}
            end={resetGame}
            players={players}
          />
        </>
      )}
    </div>
  );
};

const GetInfo = ({
  players,
  setPlayers,
  setPlayersReady,
}: {
  players: {
    player1: string;
    player2: string;
  };
  setPlayers: React.Dispatch<
    React.SetStateAction<{
      player1: string;
      player2: string;
    }>
  >;
  setPlayersReady: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const boyAvatar = (
    <div style={{ display: "flex", position: "absolute", top: 3, left: 7 }}>
      <Image alt={"avatar01"} src={"/avatar01.svg"} width={37} height={49} />
    </div>
  );

  const girlAvatar = (
    <div style={{ display: "flex", position: "absolute", top: 2, left: 4 }}>
      <Image alt={"avatar02"} src={"/avatar02.svg"} width={43} height={48} />
    </div>
  );
  return (
    <div className={classes.getInfoWrapper}>
      <div className={classes.getInfo}>
        <div
          style={{
            border: `1px solid #CCE2D3`,
            background: "#DCF6E4",
          }}
          className={`${classes.getPlayerInfo} ${classes.getPlayer1Info}`}
        >
          <div className={`${classes.avatarWrapper} ${classes.getInfo1Border}`}>
            {boyAvatar}
          </div>
          <div className={classes.getInfoRightSec}>
            <div className={classes.inpWrapper}>
              <div className={classes.playerInfoHeading}>Player 01</div>
              <input
                className={classes.inp}
                type="text"
                value={players.player1}
                placeholder="David"
                onChange={(e) => {
                  setPlayers((prev) => ({ ...prev, player1: e.target.value }));
                }}
              ></input>
            </div>
          </div>
        </div>
        <div className={`${classes.getPlayerInfo} ${classes.getPlayer2Info}`}>
          <div className={`${classes.avatarWrapper} ${classes.getInfo2Border}`}>
            {girlAvatar}
          </div>
          <div className={classes.getInfoRightSec}>
            <div className={classes.inpWrapper}>
              <div className={classes.playerInfoHeading}>Player 02</div>
              <input
                type="text"
                value={players.player2}
                placeholder="Maria"
                onChange={(e) => {
                  setPlayers((prev) => ({ ...prev, player2: e.target.value }));
                }}
                className={classes.inp}
              ></input>
            </div>
          </div>
        </div>
        <hr></hr>
        <button
          style={{ width: "100%" }}
          className={classes.undoBtn}
          onClick={() => setPlayersReady(true)}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

const ConnectFour = () => {
  const [players, setPlayers] = useState({
    player1: "",
    player2: "",
  });
  const [playersReady, setPlayersReady] = useState(false);
  return (
    <div className={classes.connectFourWrapper}>
      {playersReady ? (
        <GameScreen players={players} />
      ) : (
        <GetInfo
          players={players}
          setPlayers={setPlayers}
          setPlayersReady={setPlayersReady}
        />
      )}
    </div>
  );
};

export default ConnectFour;
