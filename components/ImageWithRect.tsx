import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';

type ImageWithRectProp = {
  fileSrc?: string;
};

type StageProps = {
  width: number;
  height: number;
};

export const ImageWithRect: React.FC<ImageWithRectProp> = ({ fileSrc }) => {
  const [stageProps, setStageProps] = useState<StageProps | null>(null);

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
        >
          <Layer>
            <Text text="Some text on canvas" fontSize={15} />
            <Rect
              x={20}
              y={50}
              width={100}
              height={100}
              fill="red"
              shadowBlur={10}
            />
            <Circle x={200} y={100} radius={50} fill="green" />
            <Line
              x={20}
              y={200}
              points={[0, 0, 100, 0, 100, 100]}
              tension={0.5}
              closed
              stroke="black"
              fillLinearGradientStartPoint={{ x: -50, y: -50 }}
              fillLinearGradientEndPoint={{ x: 50, y: 50 }}
              fillLinearGradientColorStops={[0, 'red', 1, 'yellow']}
            />
          </Layer>
        </Stage>
      )}
    </div>
  );
};
