import {
  useType,
  useNewComponent,
  Geometry,
  Polygon,
  Vector,
  useDraw,
  Label,
  SystemFont,
  Mouse
} from '@hex-engine/2d';

type CellProps = {
  size: Vector;
  position: Vector;
  getContent: () => string;
  onClick: () => void;
};

export default function Cell({
  size,
  position,
  getContent,
  onClick
}: CellProps) {
  useType(Cell);

  useNewComponent(() => Geometry({ shape: Polygon.rectangle(size), position }));

  const font = useNewComponent(() =>
    SystemFont({ name: 'sans-serif', size: size.y })
  );

  const label = useNewComponent(() => Label({ font }));

  useDraw(context => {
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.strokeRect(0, 0, size.x, size.y);

    label.text = getContent();
    label.draw(context);
  });

  const mouse = useNewComponent(Mouse);
  mouse.onClick(onClick);
}
