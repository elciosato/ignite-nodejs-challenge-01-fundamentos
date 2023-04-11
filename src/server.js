import http from "node:http";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const PORT = 3000;
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);
  const route = routes.find((route) => {
    return route.method === method && route.url.test(url);
  });

  if (route) {
    const routeParams = url.match(route.url);

    const { query, ...params } = routeParams.groups;
    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }
  res.writeHead(404).end();
});

server.listen(PORT, () => {
  console.log("Server listening on port:", PORT);
});
