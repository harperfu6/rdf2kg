import dynamic from "next/dynamic";

// require()はnodejs上でのみ動作するので、use clientと併用する場合はdynamicを使ってサーバー側で処理してから読み込むようにする
{/* import { LinkObject, NodeObject } from "react-force-graph-3d"; */}
const	ReactForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });
const LinkObject = ReactForceGraph3D.LinkObject;
const NodeObject = ReactForceGraph3D.NodeObject;
{/* import { ForceGraph2D } from "react-force-graph"; */}
const	ForceGraph2D = dynamic(() => import("react-force-graph").then((mod) => mod.ForceGraph2D), { ssr: false });
import { tripleType } from "../model/rdf";

const containerWidth = 1000;
const containerHeight = 1000;

type MyNodeObject = NodeObject & {
  group: string;
};

type MyLinkObject = LinkObject & {};

type GraphData = {
  nodes: MyNodeObject[];
  links: MyLinkObject[];
};

type Graph2DProps = {
  graphData: GraphData;
};

export const triple2GraphData = (triples: tripleType[]): GraphData => {
  const nodes: MyNodeObject[] = [];
  const links: MyLinkObject[] = [];
  const nodeMap: Map<string, MyNodeObject> = new Map();
  let nodeIndex = 0;
  triples.forEach((triple) => {
    const subject = triple.s;
    const predicate = triple.p;
    const object = triple.o;
    if (!nodeMap.has(subject)) {
      const node: MyNodeObject = {
        id: subject,
        group: "subject",
      };
      nodeMap.set(subject, node);
      nodes.push(node);
    }
    if (!nodeMap.has(object)) {
      const node: MyNodeObject = {
        id: object,
        group: "object",
      };
      nodeMap.set(object, node);
      nodes.push(node);
    }
    const link: MyLinkObject = {
      source: subject,
      target: object,
    };
    links.push(link);
  });
  return { nodes, links };
};

const MyGraph2D: React.FC<Graph2DProps> = ({ graphData }) => {
  return (
    <>
      <ForceGraph2D
        width={containerWidth}
        height={containerHeight}
        graphData={graphData}
        nodeAutoColorBy="group"
        nodeRelSize={1}
      />
    </>
  );
};

export default MyGraph2D;
