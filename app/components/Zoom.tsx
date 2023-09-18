import {CanvasRef} from "reaflow";

type ZoomProps = {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
	canvasRef: React.RefObject<CanvasRef>;
};

const Zoom: React.FC<ZoomProps> = ({ zoom, setZoom, canvasRef }) => {
	const onClickZoomIn = () => {
		canvasRef.current?.zoomIn();
		setZoom(canvasRef.current.zoom);
	};

	const onClickZoomOut = () => {
		canvasRef.current?.zoomOut();
		setZoom(canvasRef.current.zoom);
	};

	const onClickFit = () => {
		canvasRef.current?.fitCanvas();
		setZoom(canvasRef.current.zoom);
	};

	const floorZoom = Math.floor(zoom * 10) / 10;

  return (
    <pre
      style={{
        background: "rgba(0, 0, 0, .5)",
        padding: 20,
        color: "white",
      }}
    >
      <button
        style={{
          display: "block",
          width: "100%",
          margin: "5px 0",
        }}
        onClick={() => onClickZoomIn()}
      >
        Zoom In
      </button>
      <button
        style={{
          display: "block",
          width: "100%",
          margin: "5px 0",
        }}
        onClick={() => onClickZoomOut()}
      >
        Zoom Out
      </button>
      <button
        style={{
          display: "block",
          width: "100%",
        }}
        onClick={() => onClickFit()}
      >
        Fit
      </button>
    </pre>
  );
};

export default Zoom;
