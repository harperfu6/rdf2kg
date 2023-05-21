"use client";

import { useEffect, useRef, useState } from "react";
import { GraphData } from "react-force-graph-3d";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import MyGraph2D, {
  filterLinks,
  filterNodes,
  MyLinkObject,
  MyNodeObject,
  triple2GraphData,
} from "./components/MyGraph2D";
import SearchList from "./components/SearchList";
import { removeDuplicateText } from "./utils";

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
  const [filterWord, setFilterWord] = useState<string>("");
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [filteredGraphData, setFilteredGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });

  const [filteredNodesTextList, setFilteredNodesTextList] = useState<string[]>(
    []
  );
  const [filteredLinksTextList, setFilteredLinksTextList] = useState<string[]>(
    []
  );

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
    const _filteredGraphData = {
      nodes: filteredNodes,
      links: filteredLinks,
    };
    setGraphData(_graphData);
    setFilteredGraphData(_filteredGraphData);
		console.log(_filteredGraphData);
  };

  const onFilter = async () => {
    // 取得済みグラフデータからフィルタリング
    const _filteredNodes = graphData.nodes.filter((node: MyNodeObject) =>
      filteredNodesTextList.includes(node.id)
    );

    const _filteredLinks = graphData.links.filter((link: MyLinkObject) =>
      filteredNodesTextList.includes(link.target.id)
    );

    const _filteredGraphData = {
      nodes: _filteredNodes,
      links: _filteredLinks,
    };
		{/* console.log(_filteredGraphData); */}
    setFilteredGraphData(_filteredGraphData);
  };

  return (
    <>
      <div className="flex flex-row my-4">
        <div className="basis-1/6 mx-2 space-y-2">
          <div className="flex flex-row">
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="basis-3/4 border border-gray-400 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={onSearch}
              className="basis-1/4 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2"
            >
              Search
            </button>
          </div>

          {filteredGraphData.nodes.length > 0 && (
            <SearchList
              contentList={removeDuplicateText(
                filteredGraphData.nodes.map((node: MyNodeObject) => node.id)
              )}
              checkedContentList={filteredNodesTextList}
              setCheckedContentList={setFilteredNodesTextList}
              onSubmitContentList={onFilter}
            />
          )}
          {filteredGraphData.links.length > 0 && (
            <SearchList
              contentList={removeDuplicateText(
                filteredGraphData.links.map((link: MyLinkObject) => link.id)
              )}
              checkedContentList={filteredLinksTextList}
              setCheckedContentList={setFilteredLinksTextList}
              onSubmitContentList={onFilter}
            />
          )}
        </div>

        <div
          ref={divRef}
          className="basis-4/6 h-screen max-h-[80vh] mx-2 border border-solid border-black"
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
