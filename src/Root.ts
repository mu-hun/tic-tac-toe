import {
  useType,
  useNewComponent,
  Canvas,
  Grid,
  Vector,
  useChild,
  SystemFont,
  Label,
  useDraw
} from '@hex-engine/2d';
import Cell from './Cell';

enum GridAction {
  PLACING_X,
  PLACING_O,
  X_WON,
  O_WON,
  TIE
}

const grid = new Grid<' ' | 'x' | 'o'>(3, 3, ' ');

const cellSize = new Vector(16, 16);
const firstCellPosition = new Vector(100, 100);

export default function Root() {
  useType(Root);

  const canvas = useNewComponent(() => Canvas({ backgroundColor: 'white' }));
  canvas.fullscreen();

  let state = GridAction.PLACING_X;

  function checkForWinCondition() {
    for (const [rowIndex, columnIndex, value] of grid.contents()) {
      if (value === 'x' || value === 'o') {
        const up = grid.get(rowIndex - 1, columnIndex);
        const down = grid.get(rowIndex + 1, columnIndex);

        const left = grid.get(rowIndex, columnIndex - 1);
        const right = grid.get(rowIndex, columnIndex + 1);

        const upLeft = grid.get(rowIndex - 1, columnIndex - 1);
        const upRight = grid.get(rowIndex - 1, columnIndex + 1);

        const downLeft = grid.get(rowIndex + 1, columnIndex - 1);
        const downRight = grid.get(rowIndex + 1, columnIndex + 1);

        if (
          (up === value && down === value) ||
          (left === value && right === value) ||
          (upLeft === value && downRight === value) ||
          (upRight === value && downLeft === value)
        ) {
          state = value === 'x' ? GridAction.X_WON : GridAction.O_WON;
        }
      }
    }
  }

  for (const [rowIndex, columnIndex] of grid.contents()) {
    useChild(() => {
      const content = grid.get(rowIndex, columnIndex);
      if (content !== ' ') return;

      return Cell({
        size: cellSize,
        position: firstCellPosition
          .addX(cellSize.x * rowIndex)
          .addY(cellSize.y * columnIndex),
        getContent: () => grid.get(rowIndex, columnIndex),
        onClick: () => {
          switch (state) {
            case GridAction.PLACING_X: {
              grid.set(rowIndex, columnIndex, 'x');
              state = GridAction.PLACING_O;
              break;
            }
            case GridAction.PLACING_O: {
              grid.set(rowIndex, columnIndex, 'o');
              state = GridAction.PLACING_X;
              break;
            }
          }
          checkForWinCondition();
        }
      });
    });
  }

  const font = useNewComponent(() =>
    SystemFont({ name: 'sans-serif', size: 14 })
  );
  const stateLabel = useNewComponent(() => Label({ font }));

  useDraw(context => {
    switch (state) {
      case GridAction.PLACING_X:
        stateLabel.text = "X's turn";
        break;
      case GridAction.PLACING_O:
        stateLabel.text = "O's turn";
        break;
      case GridAction.X_WON:
        stateLabel.text = 'X won';
        break;
      case GridAction.O_WON:
        stateLabel.text = 'O won';
        break;
      case GridAction.TIE:
        stateLabel.text = 'Tie game';
        break;
    }

    stateLabel.draw(context);
  });
}
