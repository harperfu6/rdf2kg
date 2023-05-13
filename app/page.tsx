"use client";

import useSWR from "swr";
import MyGraph2D, { triple2GraphData } from "./components/MyGraph2D";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home = () => {
  const { data, error, isLoading } = useSWR("/api/query", fetcher);

  if (error) return <div>Error</div>;
  if (isLoading) return <div>Loading...</div>;

  const graphData = triple2GraphData(data);
  console.log(graphData);

  return (
    <>
      <MyGraph2D graphData={graphData} />
    </>
  );
};

export default Home;
