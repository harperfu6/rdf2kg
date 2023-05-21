"use client";

import { useEffect, useRef, useState } from "react";
import { GraphData } from "react-force-graph-3d";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import MyGraph2D, {
  filterLinks,
  filterNodes,
  triple2GraphData,
} from "./components/MyGraph2D";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const searchWordFetcher = async (url: string, searchWord: { arg: string }) => {
  const data = await fetch(`${url}?searchWord=${searchWord.arg}`);
  return data.json();
};

// const SEARCH_WORD = "東京都";
const SEARCH_WORD = "ローソン";
// const SEARCH_WORD = "東証一部上場企業";

const Home = () => {
  const divRef = useRef(null);
  const [graphViewWidth, setGraphViewWidth] = useState<number>(0);
  const [graphViewHeight, setGraphViewHeight] = useState<number>(0);

  const [searchWord, setSearchWord] = useState<string>("ローソン");
  const [filterWord, setFilterWord] = useState<string>("Category");
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [filteredGraphData, setFilteredGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });

  const {
    trigger: searchWordTrigger,
    error,
    isMutating,
  } = useSWRMutation(`/api/query`, searchWordFetcher);

  useEffect(() => {
    if (divRef.current) {
      setGraphViewWidth(divRef.current.clientWidth);
      setGraphViewHeight(divRef.current.clientHeight);
    }
  }, []);

  {
    /* if (isMutating) return <Spinner />; */
  }
  if (error) return <div>failed to load</div>;

  const onSearch = async () => {
    const rawData = await searchWordTrigger(searchWord);
    const _graphData = await triple2GraphData(rawData);
    const filteredNodes = await filterNodes(
      _graphData.nodes,
      filterWord,
      searchWord
    );
    const filteredLinks = await filterLinks(
      _graphData.links,
      filterWord,
      searchWord
    );
    const filteredGraphData = {
      nodes: filteredNodes,
      links: filteredLinks,
    };
    setGraphData(_graphData);
    setFilteredGraphData(filteredGraphData);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="my-4 space-y-2">
          <div>
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="border border-gray-400 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={onSearch}
              className="bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-2"
            >
              Search
            </button>
          </div>
          <div>
            <input
              type="text"
              value={filterWord}
              onChange={(e) => setFilterWord(e.target.value)}
              className="border border-gray-400 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={onSearch}
              className="bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-2"
            >
              Filter
            </button>
          </div>
        </div>

        <div
          ref={divRef}
          className="w-screen h-screen max-h-[80vh] border border-solid border-black"
        >
          {isMutating && (
            <div className="flex justify-center items-center h-screen max-h-[80vh]">
              <p className="text-center">Loading...</p>{" "}
            </div>
          )}
          {!isMutating && filteredGraphData.nodes.length > 0 && (
            <MyGraph2D
              viewWidth={graphViewWidth}
              viewHeight={graphViewHeight}
              graphData={filteredGraphData}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
