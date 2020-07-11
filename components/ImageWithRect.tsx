import React, { useState } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import { KonvaEventObject } from 'konva/types/Node';

type ImageWithRectProp = {
  fileSrc?: string;
};

type StageProps = {
  width: number;
  height: number;
};

type RectangleProps = {
  shapeProps: RectProp;

  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: RectProp) => void;
};

const Rectangle: React.FC<RectangleProps> = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}) => {
  const shapeRef = React.useRef(null);
  const trRef = React.useRef(null);

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      (trRef.current as any).nodes([shapeRef.current]);
      (trRef.current as any).getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(_e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current as any;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

type RectProp = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  id: string;
};

const initialRectangles: RectProp[] = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: 'red',
    id: 'rect1',
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: 'green',
    id: 'rect2',
  },
];

export const ImageWithRect: React.FC<ImageWithRectProp> = ({ fileSrc }) => {
  const [stageProps, setStageProps] = useState<StageProps | null>(null);

  const [rectangles, setRectangles] = React.useState(initialRectangles);
  const [selectedId, selectShape] = React.useState<string | null>(null);

  const checkDeselect = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
  ) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  React.useEffect(() => {
    console.log('rectangles:', rectangles);
  }, [rectangles]);

  return (
    <div className="relative">
      <img
        onLoad={(e) => {
          const newStageProps: StageProps = {
            width: (e.target as HTMLImageElement).width,
            height: (e.target as HTMLImageElement).height,
          };
          console.warn(
            'loaded image: ',
            e.nativeEvent,
            '\nstageProps:',
            newStageProps
          );
          setStageProps(newStageProps);
          //debugger;
        }}
        src={fileSrc}
      ></img>
      {stageProps && (
        <Stage
          width={stageProps.width}
          height={stageProps.height}
          className="absolute h-full inset-0 w-full"
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <Layer>
            {rectangles.map((rect, i) => {
              return (
                <Rectangle
                  key={i}
                  shapeProps={rect}
                  isSelected={rect.id === selectedId}
                  onSelect={() => {
                    selectShape(rect.id);
                  }}
                  onChange={(newAttrs: RectProp) => {
                    const rects = rectangles.slice();
                    rects[i] = newAttrs;
                    setRectangles(rects);
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      )}
    </div>
  );
};
