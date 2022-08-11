import { Handlers } from "$fresh/server.ts";
import { graphqlClient } from "@/utils/graphql.ts";

export const handler: Handlers = {
  async POST(req) {
    const { query, variables } = await req.json();
    const data = await graphqlClient(query, variables);
    return Response.json(data);
  },
};
