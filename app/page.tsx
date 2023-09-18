"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasRef } from "reaflow";
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
import Zoom from "./components/Zoom";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const searchWordFetcher = async (url: string, searchWords: { arg: string }) => {
  const data = await fetch(`${url}?searchWords=${searchWords.arg}`);
  return data.json();
};

const SEARCH_WORD = "ローソン ファミリーマート";
const defaultFilteredInRegexes = [
  // resourceノードのみを抽出
  "http://ja.dbpedia.org/resource/+",
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
  const canvasRef = useRef<CanvasRef>(null);
  const [zoom, setZoom] = useState<number>(0.1);
  const [canvas, setCanvas] = useState({
    zoom: 0.1,
  });

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

  // get data from api
  // const {
  //   trigger: searchWordTrigger,
  //   error,
  //   isMutating,
  // } = useSWRMutation(`/api/query`, searchWordFetcher);

  // get data from file
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
    // get data from api
    // const triples = await searchWordTrigger(searchWords);
    // console.log(triples);

    // get data from file
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
          <Zoom zoom={zoom} setZoom={setZoom} canvasRef={canvasRef} />
        </div>
        <div
          ref={divRef}
          className="basis-5/6 h-screen max-h-[95vh] mx-2 border border-solid border-black"
        >
          <MyReaflow
            viewWidth={graphViewWidth}
            viewHeight={graphViewHeight}
            triples={triples}
            zoom={zoom}
            setZoom={setZoom}
            canvasRef={canvasRef}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
