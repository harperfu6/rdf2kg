import React, { useRef, useState } from "react";
import { Canvas, NodeData, EdgeData, CanvasRef } from "reaflow";
import { Triple } from "../model/rdf";

type FlowData = {
  nodes: NodeData[];
  edges: EdgeData[];
};

const triple2FlowData = (triples: Triple[]): FlowData => {
  const nodes: NodeData[] = [];
  const edges: EdgeData[] = [];
  triples.forEach((triple) => {
    const subject = triple.s;
    const object = triple.o;
    if (!nodes.find((node) => node.text === subject)) {
      nodes.push({ id: subject, text: subject });
    }
    if (!nodes.find((node) => node.text === object)) {
      nodes.push({ id: object, text: object });
    }
    if (!edges.find((edge) => edge.id === `${subject}-${object}`)) {
      edges.push({ id: `${subject}-${object}`, from: subject, to: object });
    }
  });

  return { nodes, edges };
};

type MyReaflowProps = {
  viewWidth: number;
  viewHeight: number;
  triples: Triple[];
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  canvasRef: React.RefObject<CanvasRef>;
};

const MyReaflow: React.FC<MyReaflowProps> = ({
  viewWidth,
  viewHeight,
  triples,
  zoom,
  setZoom,
  canvasRef,
}) => {
  const tripleLengthThreshold = 200;

  const { nodes, edges } = triple2FlowData(
    triples.slice(0, Math.min(triples.length - 1, tripleLengthThreshold))
  );
  // console.log("nodes", nodes);
  // console.log("edges", edges);

  // console.log("zoom", zoom);

  return (
    <>
      {triples.length > tripleLengthThreshold && (
        <>
          <div>Showing only first {tripleLengthThreshold} triples </div>
          <div>Potentially {triples.length} triples </div>
        </>
      )}
      <Canvas
        width={viewWidth}
        height={viewHeight}
        maxZoom={2.0}
        minZoom={-2.0}
        direction="RIGHT"
        zoom={zoom}
        ref={canvasRef}
        nodes={nodes}
        edges={edges}
        onZoomChange={(z) => {
          setZoom(z);
        }}
      />
    </>
  );

  //return (
  //  <div
  //    style={{
  //      position: "absolute",
  //      top: 0,
  //      bottom: 0,
  //      left: 0,
  //      right: 0,
  //    }}
  //  >
  //    <pre
  //      style={{
  //        zIndex: 9,
  //        position: "absolute",
  //        bottom: 15,
  //        right: 15,
  //        background: "rgba(0, 0, 0, .5)",
  //        padding: 20,
  //        color: "white",
  //      }}
  //    >
  //      Zoom: {zoom}
  //      <br />
  //      <button
  //        style={{
  //          display: "block",
  //          width: "100%",
  //          margin: "5px 0",
  //        }}
  //        onClick={() => ref.current.zoomIn()}
  //      >
  //        Zoom In
  //      </button>
  //      <button
  //        style={{
  //          display: "block",
  //          width: "100%",
  //          margin: "5px 0",
  //        }}
  //        onClick={() => ref.current.zoomOut()}
  //      >
  //        Zoom Out
  //      </button>
  //      <button
  //        style={{
  //          display: "block",
  //          width: "100%",
  //        }}
  //        onClick={() => ref.current.fitCanvas()}
  //      >
  //        Fit
  //      </button>
  //    </pre>
  //    <Canvas
  //      width={viewWidth}
  //      height={viewHeight}
  //      maxZoom={0.2}
  //      minZoom={-0.9}
  //      direction="RIGHT"
  //      zoom={zoom}
  //      ref={ref}
  //      nodes={nodes}
  //      edges={edges}
  //      onZoomChange={(z) => {
  //        setZoom(z);
  //      }}
  //      onLayoutChange={(layout) => console.log("Layout", layout)}
  //    />
  //  </div>
  //);
};

export default MyReaflow;
