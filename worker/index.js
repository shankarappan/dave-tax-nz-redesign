export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const routeUrl = new URL(request.url);
    routeUrl.pathname = `${routeUrl.pathname.replace(/\/$/, "")}/index.html`;
    routeUrl.search = "";
    const routeResponse = await env.ASSETS.fetch(new Request(routeUrl, request));
    if (routeResponse.status !== 404) return routeResponse;

    const notFoundUrl = new URL(request.url);
    notFoundUrl.pathname = "/404.html";
    notFoundUrl.search = "";
    const notFound = await env.ASSETS.fetch(new Request(notFoundUrl, request));
    return new Response(notFound.body, { status: 404, headers: notFound.headers });
  },
};
