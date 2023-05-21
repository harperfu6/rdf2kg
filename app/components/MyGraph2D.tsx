import dynamic from "next/dynamic";
import { NodeObject } from "react-force-graph-3d";

// require()はnodejs上でのみ動作するので、use clientと併用する場合はdynamicを使ってサーバー側で処理してから読み込むようにする
const ReactForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});
const NodeObject = ReactForceGraph3D.NodeObject;
const LinkObject = ReactForceGraph3D.LinkObject;
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

// エディタのエラーを回避するため。動作確認時はコメントアウトする
// import { LinkObject, NodeObject } from "react-force-graph-3d";
// import { ForceGraph2D } from "react-force-graph";

import { tripleType } from "../model/rdf";

export type MyNodeObject = NodeObject & {
  group: string;
};

export type MyLinkObject = LinkObject & {
	id: string;
};

export type GraphData = {
  nodes: MyNodeObject[];
  links: MyLinkObject[];
};

export const filterNodes = async (
  nodes: MyNodeObject[],
  filterWord: string,
  searchWord: string
): Promise<MyNodeObject> => {
  const filteredNodes = nodes.filter((node) => {
    return node.id.includes(filterWord);
  });
  const searchNode = nodes.filter((node) => {
    return node.id === searchWord;
  });
  filteredNodes.push(searchNode[0]);
  return filteredNodes;
};

export const filterLinks = async (
  links: MyLinkObject[],
  filterWord: string,
  searchWord: string
): Promise<MyLinkObject> => {
  const filteredLinks = links.filter((link) => {
    return link.source === searchWord && link.target.includes(filterWord);
  });
  return filteredLinks;
};

export const triple2GraphData = async (
  triples: tripleType[]
): Promise<GraphData> => {
  const nodes: MyNodeObject[] = [];
  const links: MyLinkObject[] = [];
  const nodeMap: Map<string, MyNodeObject> = new Map();
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
			id: predicate,
      source: subject,
      target: object,
    };
    links.push(link);
  });
  return { nodes, links };
};

const getNodeText = (node: MyNodeObject): string => {
  const nodeText = node.id;
  // 一番後ろのコロンの後ろの文字列を取得
  const nodeTextArray = nodeText.split(":");
  return nodeTextArray[nodeTextArray.length - 1];
};

type Graph2DProps = {
  viewWidth: number;
  viewHeight: number;
  graphData: GraphData;
};

const MyGraph2D: React.FC<Graph2DProps> = ({
  viewWidth,
  viewHeight,
  graphData,
}) => {
  return (
    <>
      <ForceGraph2D
        width={viewWidth}
        height={viewHeight}
        graphData={graphData}
        nodeAutoColorBy="group"
        nodeRelSize={1}
        nodeCanvasObject={(node: MyNodeObject, ctx, globalScale) => {
          const label = getNodeText(node);
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;

          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.2
          ); // some padding
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = node.color;
          ctx.fillText(label, node.x, node.y);

          node.__bckgDimensions = bckgDimensions;
        }}
      />
    </>
  );
};

export default MyGraph2D;
