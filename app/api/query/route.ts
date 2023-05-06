import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";
import arrayifyStream from "arrayify-stream";

const queryReq = async () => {
  const fether = new SparqlEndpointFetcher();
  const endpoint = "https://dbpedia.org/sparql";
  const query = `
		PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
		SELECT ?p ?c WHERE {
			?p a dbpedia-owl:Artist.
    	?p dbpedia-owl:birthPlace ?c.
    	?c <http://xmlns.com/foaf/0.1/name> "York"@en.
		}
		`;
  return await arrayifyStream(await fether.fetchBindings(endpoint, query));
};

export const GET = async (request: Request) => {
  const response = await queryReq();
  return new Response(JSON.stringify(response));
};
