"use client";

import React from "react";
import { FireplaceCanvas } from "./animations/fireplace-canvas";
import { RainCanvas } from "./animations/rain-canvas";
import { AquariumCanvas } from "./animations/aquarium-canvas";

type CanvasRendererProps = {
  animationType: "fireplace" | "rain" | "aquarium" | "none";
};

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  animationType,
}) => {
  const renderCanvas = () => {
    switch (animationType) {
      case "fireplace":
        return <FireplaceCanvas />;
      case "rain":
        return <RainCanvas />;
      case "aquarium":
        return <AquariumCanvas />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 bg-black">{renderCanvas()}</div>
  );
};
