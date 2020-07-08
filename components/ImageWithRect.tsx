import React from 'react';

type ImageWithRectProp = {
  fileSrc?: string;
};

export const ImageWithRect: React.FC<ImageWithRectProp> = ({ fileSrc }) => {
  return (
    <div>
      <div className="relative">
        <img src={fileSrc}></img>
        <canvas
          className="absolute h-full inset-0 w-full"
          onClick={(e) => {
            console.log('canvas click: ', e);
          }}
        />
      </div>
    </div>
  );
};
