import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";
import arrayifyStream from "arrayify-stream";
import { rawResponseType, tripleType } from "@/app/model/rdf";

const PREFIX = `
PREFIX prop-ja: <http://ja.dbpedia.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

PREFIX dcterms: <http://purl.org/dc/terms/>
`;

const p = "dcterms:subject";

const SELECT_QUERY = (searchWord: string) => `
SELECT DISTINCT *
WHERE
{
  <http://ja.dbpedia.org/resource/${searchWord}> ${p} ?o .
}
`;

const SELECT_QUERY_GENERAL = (searchWord: string) => `
SELECT DISTINCT *
WHERE
{
  <http://ja.dbpedia.org/resource/${searchWord}> ?p ?o .
}
`;

const queryReq = async (searchWord: string) => {
  const config = {
    method: "GET",
  };
  const fether = new SparqlEndpointFetcher(config);
  const endpoint = "http://ja.dbpedia.org/sparql";
  const query = `
	${PREFIX}
	${SELECT_QUERY_GENERAL(searchWord)}
	`;
  return await arrayifyStream(await fether.fetchBindings(endpoint, query));
};

const raw2response = (
  searchWord: string,
  rawResponseList: rawResponseType[]
): tripleType[] => {
  return rawResponseList.map((rawResponse: rawResponseType) => {
    return {
      s: searchWord,
      p: rawResponse.p.value,
      o: rawResponse.o.value,
    };
  });
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const searchWord = searchParams.get("searchWord");

  const rawResponseList = await queryReq(searchWord);
  const responseList = raw2response(searchWord, rawResponseList);
  return new Response(JSON.stringify(responseList));
};
