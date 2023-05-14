"use client";

import useSWR from "swr";
import MyGraph2D, {
	filterLinks,
  filterNodes,
  triple2GraphData,
} from "./components/MyGraph2D";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// const SEARCH_WORD = "東京都";
const SEARCH_WORD = "ローソン";
// const SEARCH_WORD = "東証一部上場企業";

const Home = () => {
  const { data, error, isLoading } = useSWR(
    `/api/query?searchWord=${SEARCH_WORD}`,
    fetcher
  );

  if (error) return <div>Error</div>;
  if (isLoading) return <div>Loading...</div>;

  const graphData = triple2GraphData(data);

  const filterWord = "Category";
  const filteredNodes = filterNodes(graphData.nodes, filterWord, SEARCH_WORD);
	const filteredLinks = filterLinks(graphData.links, filterWord, SEARCH_WORD);

  const filteredGraphData = {
    nodes: filteredNodes,
    links: filteredLinks,
  };

  return (
    <>
      <MyGraph2D graphData={filteredGraphData} />
    </>
  );
};

export default Home;
