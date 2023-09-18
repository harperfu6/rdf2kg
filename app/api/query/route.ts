import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";
import arrayifyStream from "arrayify-stream";
import { rawResponseType, Triple } from "@/app/model/rdf";

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

// const SELECT_QUERY_GENERAL = (searchWords: string[]) => {
//   const whereClouse = searchWords.reduce((acc: string, searchWord: string) => {
//     return acc + `<http://ja.dbpedia.org/resource/${searchWord}> ?p ?o .\n`;
//   }, "");
// 
//   return `
// 	SELECT DISTINCT *
// 	WHERE
// 	{
// 	${whereClouse}
// 	}
// 	`;
// };

const SELECT_QUERY_GENERAL = (searchWords: string[]) =>
	//`
	//SELECT DISTINCT *
	//WHERE
	//{
	//	{
	//		?s ?p ?o
	//		FILTER (?s = <http://ja.dbpedia.org/resource/ローソン>)
	//	}
	//	UNION
	//	{
	//		?s ?p ?o
	//		FILTER (?s = <http://ja.dbpedia.org/resource/ファミリーマート>)
	//	}
	//}
	//`
	`
	SELECT DISTINCT *
	WHERE
	{
		{
			?s ?p ?o
			FILTER (?s = <http://ja.dbpedia.org/resource/ローソン>)
		}
		UNION
		{
			?s ?p ?o
			FILTER (?s = <http://ja.dbpedia.org/resource/ファミリーマート>)
		}
	}
	`

// `
// SELECT DISTINCT *
// WHERE
// {
//   <http://ja.dbpedia.org/resource/${searchWord}> ?p ?o .
// }
// `;

const queryReq = async (searchWords: string[]) => {
  // return SELECT_QUERY_GENERAL(searchWords);

  const config = {
    method: "GET",
  };
  const fether = new SparqlEndpointFetcher(config);
  const endpoint = "http://ja.dbpedia.org/sparql";
  const query = `
	${PREFIX}
	${SELECT_QUERY_GENERAL(searchWords)}
	`;
  return await arrayifyStream(await fether.fetchBindings(endpoint, query));
};

const raw2response = (
  searchWords: string[],
  rawResponseList: rawResponseType[]
): Triple[] => {
  return searchWords
    .map((searchWord: string) => {
      return rawResponseList.map((rawResponse: rawResponseType) => {
        return {
          // s: searchWord,
          s: rawResponse.s.value,
          p: rawResponse.p.value,
          o: rawResponse.o.value,
        };
      });
    })
    .flat();
};


const serchWordsStr2Array = (searchWordsStr: string): string[] => {
  return searchWordsStr.split(" ");
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const searchWordsStr = searchParams.get("searchWords");
  const searchWords = serchWordsStr2Array(searchWordsStr!);

  const rawResponseList = await queryReq(searchWords);
  const responseList = raw2response(searchWords, rawResponseList);
  return new Response(JSON.stringify(responseList));
};
