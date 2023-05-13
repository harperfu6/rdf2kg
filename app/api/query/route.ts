import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";
import arrayifyStream from "arrayify-stream";
import { rawResponseType, tripleType } from "@/app/model/rdf";

// const SEARCH_WORD = "東京都";
const SEARCH_WORD = "ローソン";
// const SEARCH_WORD = "東証一部上場企業";

const PREFIX = `
PREFIX prop-ja: <http://ja.dbpedia.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

PREFIX dcterms: <http://purl.org/dc/terms/>
`;

const p = "dcterms:subject";

const SELECT_QUERY = `
SELECT DISTINCT *
WHERE
{
  <http://ja.dbpedia.org/resource/${SEARCH_WORD}> ${p} ?o .
}
`;

const SELECT_QUERY_GENERAL = `
SELECT DISTINCT *
WHERE
{
  <http://ja.dbpedia.org/resource/${SEARCH_WORD}> ?p ?o .
}
`;

const queryReq = async () => {
  const config = {
    method: "GET",
  };
  const fether = new SparqlEndpointFetcher(config);
  const endpoint = "http://ja.dbpedia.org/sparql";
  const query = `
	${PREFIX}
	${SELECT_QUERY_GENERAL}
	`;
  return await arrayifyStream(await fether.fetchBindings(endpoint, query));
};

const raw2response = function (
  rawResponseList: rawResponseType[]
): tripleType[] {
  return rawResponseList.map((rawResponse: rawResponseType) => {
    return {
      s: SEARCH_WORD,
      p: rawResponse.p.value,
      o: rawResponse.o.value,
    };
  });
};

export const GET = async (request: Request) => {
  const rawResponseList = await queryReq();
  const responseList = raw2response(rawResponseList);
  // const responseList = rawResponseList;
  return new Response(JSON.stringify(responseList));
};
