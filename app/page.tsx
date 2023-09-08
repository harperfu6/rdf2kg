"use client";

import { useEffect, useRef, useState } from "react";
import { GraphData } from "react-force-graph-3d";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import FilterPattern from "./components/FilterPattern";
import MyGraph2D, {
  DataType,
  filterByLinks,
  filterByNodes,
  MyLinkObject,
  MyNodeObject,
  triple2GraphData,
} from "./components/MyGraph2D";
import MyReaflow from "./components/MyReaflow";
import SearchList from "./components/SearchList";
import { Triple } from "./model/rdf";
import {
  filterInTriple,
  filterOutTriple,
  removeDuplicateDataObject,
  removeDuplicateText,
} from "./utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const searchWordFetcher = async (url: string, searchWords: { arg: string }) => {
  const data = await fetch(`${url}?searchWords=${searchWords.arg}`);
  return data.json();
};

const SEARCH_WORD = "ローソン ファミリーマート";
const defaultFilteredInRegexes = [
  // resourceノードのみを抽出
	// "http://ja.dbpedia.org/resource/+",
	// "http://ja.dbpedia.org/resource/Category+",
];
const defaultFilteredOutRegexes = [
  // 日付ノードは除外
	"http://ja.dbpedia.org/resource/(\\d{1})月(\\d{1})日",
  "http://ja.dbpedia.org/resource/(\\d{1})月(\\d{2})日",
  "http://ja.dbpedia.org/resource/(\\d{2})月(\\d{1})日",
  "http://ja.dbpedia.org/resource/(\\d{2})月(\\d{2})日",
  "http://ja.dbpedia.org/resource/(\\d{4})年",
  // テンプレートノードは除外
  "http://ja.dbpedia.org/resource/Template:+",
];

const Home = () => {
  const divRef = useRef(null);
  const [graphViewWidth, setGraphViewWidth] = useState<number>(0);
  const [graphViewHeight, setGraphViewHeight] = useState<number>(0);

  const [triples, setTriples] = useState<Triple[]>([]);

  const [searchWords, setSearchWords] = useState<string>(SEARCH_WORD);
  const [filteredInRegexes, setFilteredInRegexes] = useState<string[]>(
    defaultFilteredInRegexes
  );
  const [filteredOutRegexes, setFilteredOutRegexes] = useState<string[]>(
    defaultFilteredOutRegexes
  );

  // const [graphData, setGraphData] = useState<GraphData>({
  //   nodes: [],
  //   links: [],
  // });
  // const [filteredGraphData, setFilteredGraphData] = useState<GraphData>({
  //   nodes: [],
  //   links: [],
  // });
  // const [filteredNodesList, setFilteredNodesList] = useState<MyNodeObject[]>(
  //   []
  // );
  // const [filteredLinksList, setFilteredLinksList] = useState<MyLinkObject[]>(
  //   []
  // );

	// const {
  //   trigger: searchWordTrigger,
  //   error,
  //   isMutating,
  // } = useSWRMutation(`/api/query`, searchWordFetcher);

	// read local test file
  const {
    trigger: trigger,
    error,
    isMutating,
  } = useSWRMutation(`/api/file`, fetcher);

  useEffect(() => {
    if (divRef.current) {
      setGraphViewWidth(divRef.current.clientWidth);
      setGraphViewHeight(divRef.current.clientHeight);
    }
  }, []);

  if (error) return <div>failed to load</div>;

  const onSearch = async () => {
		// const triples = await searchWordTrigger(searchWords);
		// read local test file
    const triples = await trigger();

    const filteredTriples = filterOutTriple(
      filterInTriple(triples, filteredInRegexes),
      filteredOutRegexes
    );
    setTriples(filteredTriples);
    // const _graphData = await triple2GraphData(triples);
    // setGraphData(_graphData);

    // setFilteredGraphData(_graphData);
  };

  // const onFilter = (filteredType: DataType) => () => {
  //   let _filteredGraphData: GraphData;
  //   if (filteredType === "node") {
  //     // 取得済みグラフデータからフィルタリング
  //     // 検索ワードは必ず入るようにする
  //     const searchWordNodeObject = graphData.nodes.find(
  //       (node) => node.id === searchWord
  //     );
  //     _filteredGraphData = filterByNodes(
  //       graphData,
  //       filteredNodesList.concat(searchWordNodeObject)
  //     );
  //     setFilteredGraphData(_filteredGraphData);
  //   } else if (filteredType === "link") {
  //     _filteredGraphData = filterByLinks(graphData, filteredLinksList);
  //     setFilteredGraphData(_filteredGraphData);
  //   }
  // };

  // return (
  //   <>
  //     <div className="flex flex-row my-4">
  //       <div className="basis-1/6 mx-2 space-y-2">
  //         <div className="flex flex-row">
  //           <input
  //             type="text"
  //             value={searchWord}
  //             onChange={(e) => setSearchWord(e.target.value)}
  //             className="basis-3/4 border border-gray-400 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           />
  //           <button
  //             onClick={onSearch}
  //             className="basis-1/4 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2"
  //           >
  //             Search
  //           </button>
  //         </div>

  //         {filteredGraphData.links.length > 0 && (
  //           <SearchList
  //             dataType="link"
  //             contentList={removeDuplicateDataObject(graphData.links)}
  //             checkedContentList={filteredLinksList}
  //             setCheckedContentList={setFilteredLinksList}
  //             onSubmitContentList={onFilter("link")}
  //           />
  //         )}

  //         {filteredGraphData.nodes.length > 0 && (
  //           <SearchList
  //             dataType="node"
  //             contentList={removeDuplicateDataObject(graphData.nodes).filter(
  //               (nodeObject: MyNodeObject) => nodeObject.id !== searchWord
  //             )}
  //             checkedContentList={filteredNodesList}
  //             setCheckedContentList={setFilteredNodesList}
  //             onSubmitContentList={onFilter("node")}
  //           />
  //         )}
  //       </div>

  //       <div
  //         ref={divRef}
  //         className="basis-4/6 h-screen max-h-[80vh] mx-2 border border-solid border-black"
  //       >
  //         {isMutating && (
  //           <div className="flex justify-center items-center h-screen max-h-[80vh]">
  //             <p className="text-center">Loading...</p>{" "}
  //           </div>
  //         )}
  //         {!isMutating && graphData.nodes.length > 0 && (
  //           <MyGraph2D
  //             viewWidth={graphViewWidth}
  //             viewHeight={graphViewHeight}
  //             graphData={filteredGraphData}
  //           />
  //         )}
  //       </div>
  //     </div>
  //   </>
  // );

  return (
    <>
      <div className="flex flex-row my-4">
        <div className="basis-1/6 mx-2 space-y-2">
          <div className="flex flex-row">
            <input
              type="text"
              value={searchWords}
              onChange={(e) => setSearchWords(e.target.value)}
              className="basis-3/4 border border-gray-400 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={onSearch}
              className="basis-1/4 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2"
            >
              Search
            </button>
          </div>
          <FilterPattern
            filterPatterns={defaultFilteredInRegexes}
            checkedFilterPatterns={filteredInRegexes}
            setCheckedFilterPatterns={setFilteredInRegexes}
            isIn={true}
          />
          <FilterPattern
            filterPatterns={defaultFilteredOutRegexes}
            checkedFilterPatterns={filteredOutRegexes}
            setCheckedFilterPatterns={setFilteredOutRegexes}
            isIn={false}
          />
        </div>
        <div
          ref={divRef}
          className="basis-5/6 h-screen max-h-[95vh] mx-2 border border-solid border-black"
        >
          <MyReaflow
            viewWidth={graphViewWidth}
            viewHeight={graphViewHeight}
            triples={triples}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
