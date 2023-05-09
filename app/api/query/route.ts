import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";
import arrayifyStream from "arrayify-stream";

const queryReq = async () => {
	const config = {
		method: "GET",
	}
  const fether = new SparqlEndpointFetcher(config);
  const endpoint = "http://ja.dbpedia.org/sparql";
  const query = `
PREFIX prop-ja: <http://ja.dbpedia.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT DISTINCT ?label ?depiction
WHERE {
  ?s prop-ja:genre <http://ja.dbpedia.org/resource/ロック_(音楽)> ;
    rdfs:label ?label .
  OPTIONAL { ?s foaf:depiction ?depiction .  }
} LIMIT 100
		`;
  return await arrayifyStream(await fether.fetchBindings(endpoint, query));
};

export const GET = async (request: Request) => {
  const response = await queryReq();
  return new Response(JSON.stringify(response));
};
