import path from "path";
import { promises as fs } from "fs";
import { Triple } from "@/app/model/rdf";

export const fetchFiles = async () => {
  const jsonDirectory = path.join(process.cwd(), "datasets", "n3");
  const fileContents = await fs.readFile(
    jsonDirectory + `/all.n3`,
    "utf8"
  );
  return fileContents;
};

const raw2Triple = (rawResponseList: string): Triple[] => {
  const tripleList = rawResponseList.split("\n").map((rawResponse: string) => {
    const triple = rawResponse.split(" ");
    return {
      s: triple[0],
      p: triple[1],
      o: triple[2],
    };
  });
  return tripleList;
};

export const GET = async (request: Request) => {
  const fileContents = await fetchFiles();
  const tripleList = raw2Triple(fileContents);
  return new Response(JSON.stringify(tripleList));
};
