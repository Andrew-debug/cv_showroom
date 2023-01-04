import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

function Cell(props: {
  isBomb: boolean;
  bombsAround: number;
  isClicked: boolean;
  setIsClicked: Function;
}) {
  const style = {
    // backgroundColor: props.isBomb ? "red" : "green",
    backgroundColor: props.isClicked
      ? props.isBomb
        ? "red"
        : "gray"
      : "green",
  };

  return (
    <Button
      onClick={() => props.setIsClicked()}
      style={style}
      variant="contained"
    >
      {props.isClicked ? props.bombsAround : "X"}
    </Button>
  );
}

enum gameStateEnum {
  inGame = "inGame",
  win = "win",
  lose = "lose",
}
function createMachine(stateMachineDefinition: any) {
  const machine = {
    value: stateMachineDefinition.initialState,
    transition(currentState: any, targetState: any) {
      console.log(currentState, targetState);
      const currentStateDefinition = stateMachineDefinition[currentState];
      if (!currentStateDefinition.transitions.includes(targetState)) {
        throw Error("that transition doesnt exists");
      }
      if (stateMachineDefinition[targetState].checkIsTransitionPossible()) {
        currentStateDefinition.onExit();
        stateMachineDefinition[targetState].onEnter();
        machine.value = targetState;
      } else {
        console.log("decline operation");
      }
      return machine.value;
    },
  };
  return machine;
}

export default function MinerGame() {
  const [open, setOpen] = useState(false);
  const [isClicledList, setIsClicledList] = useState<boolean[]>([]);
  const [field, setField] = useState<boolean[][]>([]);
  const [gameState, setGameState] = useState<gameStateEnum>(
    gameStateEnum.inGame
  );
  const bombCount = 10;
  const fieldSize = [8, 8]; // x y

  function restartGame() {
    let flatFiled = Array.from(Array(fieldSize[0] * fieldSize[1]).fill(false));
    for (let i = 0; i < bombCount; i++) {
      flatFiled[i] = true;
    }
    flatFiled.sort(() => Math.random() - 0.5);
    const newField: boolean[][] = [];
    let counter = 0;
    for (let i = 0; i < fieldSize[1]; i++) {
      newField.push([]);
      for (let j = 0; j < fieldSize[0]; j++) {
        newField[i].push(flatFiled[counter]);
        counter++;
      }
    }
    setField(newField);
    setIsClicledList(Array(fieldSize[0] * fieldSize[1]).fill(false));
  }
  useEffect(() => {
    restartGame();
    // return () => {
    //   second;
    // };
  }, []);
  const fsm = createMachine({
    initialState: gameStateEnum.inGame,
    [gameStateEnum.inGame]: {
      checkIsTransitionPossible: () => {},
      onEnter: () => {
        restartGame();
        setGameState(gameStateEnum.inGame);
      },
      onExit: () => {},
      transitions: [
        gameStateEnum.inGame,
        gameStateEnum.lose,
        gameStateEnum.win,
      ],
    },
    [gameStateEnum.win]: {
      checkIsTransitionPossible: () => {},
      onEnter: () => setGameState(gameStateEnum.win),
      onExit: () => {},
      transitions: [gameStateEnum.inGame],
    },
    [gameStateEnum.lose]: {
      checkIsTransitionPossible: () => {},
      onEnter: () => setGameState(gameStateEnum.lose),
      onExit: () => {},
      transitions: [gameStateEnum.inGame],
    },
  });

  function getBombsAround(rowIndex: number, index: number): number {
    const upperRow = field[rowIndex - 1] ? field[rowIndex - 1] : [];
    const lowerRow = field[rowIndex + 1] ? field[rowIndex + 1] : [];
    return [
      upperRow[index - 1],
      upperRow[index],
      upperRow[index + 1],
      field[rowIndex][index - 1],
      field[rowIndex][index + 1],
      lowerRow[index - 1],
      lowerRow[index],
      lowerRow[index + 1],
    ].filter((x) => x === true).length;
  }

  return (
    <>
      <Button
        onClick={() => {
          if (gameState === gameStateEnum.inGame) {
            setOpen(true);
          } else {
            fsm.transition(fsm.value, gameStateEnum.inGame);
          }
        }}
      >
        Restart
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogContentText>a u sure?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} autoFocus>
            no
          </Button>
          <Button
            onClick={() => {
              fsm.transition(fsm.value, gameStateEnum.inGame);
              setOpen(false);
            }}
          >
            yes
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={fieldSize[0]}>
          {field.map((row, r_index) => (
            <Grid
              container
              item
              spacing={1}
              columns={fieldSize[0]}
              key={r_index}
            >
              {row.map((value, index) => (
                <Grid item xs={1} key={index}>
                  <Cell
                    isBomb={value}
                    bombsAround={getBombsAround(r_index, index)}
                    isClicked={isClicledList[r_index * fieldSize[0] + index]}
                    setIsClicked={() => {
                      if (gameState === gameStateEnum.inGame) {
                        if (value) {
                          fsm.transition(fsm.value, gameStateEnum.lose);
                        } else if (
                          isClicledList.filter((x) => x === true).length ===
                          fieldSize[0] * fieldSize[1] - bombCount
                        ) {
                          fsm.transition(fsm.value, gameStateEnum.win);
                        }
                        setIsClicledList((prev) => {
                          prev[r_index * fieldSize[0] + index] = true;
                          return [...prev];
                        });
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
