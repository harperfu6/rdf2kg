import dynamic from "next/dynamic";

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
{
  /* import { LinkObject, NodeObject } from "react-force-graph-3d"; */
}
{
  /* import { ForceGraph2D } from "react-force-graph"; */
}

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

export const filterNodes = (
  nodes: MyNodeObject[],
  filterWord: string,
  searchWord: string
) => {
  const filteredNodes = nodes.filter((node) => {
    return node.id.includes(filterWord);
  });
  const searchNode = nodes.filter((node) => {
    return node.id === searchWord;
  });
  filteredNodes.push(searchNode[0]);
  console.log(filteredNodes);
  return filteredNodes;
};

export const filterLinks = (
  links: MyLinkObject[],
  filterWord: string,
  searchWord: string
) => {
  const filteredLinks = links.filter((link) => {
    return link.source === searchWord && link.target.includes(filterWord);
  });
  return filteredLinks;
};

export const triple2GraphData = (triples: tripleType[]): GraphData => {
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
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, node.x, node.y);

        }}
      />
    </>
  );
};

export default MyGraph2D;
