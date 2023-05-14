"use client";

import {
  Button,
  Col,
  Container,
  Input,
  Row,
  Spacer,
  Spinner,
	useSSR,
} from "@nextui-org/react";
import { useState } from "react";
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
	const { isBrowser } = useSSR();
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

  if (isMutating) return <Spinner />;
  if (error) return <div>failed to load</div>;

  const onSearch = async () => {
    const rawData = await searchWordTrigger(searchWord);
    const _graphData = await triple2GraphData(rawData);
    const filteredNodes = await filterNodes(_graphData.nodes, filterWord, searchWord);
    const filteredLinks = await filterLinks(_graphData.links, filterWord, searchWord);
    const filteredGraphData = {
      nodes: filteredNodes,
      links: filteredLinks,
    };
    setGraphData(_graphData);
    setFilteredGraphData(filteredGraphData);
  };

  return (
    <>
      <Container>
        <Row>
          <Input
            clearable
            bordered
            initialValue={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          />
          <Button auto onClick={onSearch}>
            Search
          </Button>
        </Row>
        <Row>
          <Input
            clearable
            bordered
            initialValue={filterWord}
            onChange={(e) => setFilterWord(e.target.value)}
          />
          <Button auto>Filter</Button>
        </Row>
      </Container>

      <div style={{ border: "1px solid black" }}>
        {filteredGraphData.nodes.length > 0 && (
          <MyGraph2D graphData={filteredGraphData} />
        )}
      </div>
    </>
  );
};

export default Home;
