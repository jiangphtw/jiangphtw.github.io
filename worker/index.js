/**
 * Static Sites adapter for the Jekyll output.
 *
 * GitHub Pages continues to build from the repository root. The Sites preview
 * packages `_site` as `dist/client` and uses this worker only for static routing.
 */
export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) return response;

    const url = new URL(request.url);
    const path = url.pathname;

    if (path.endsWith("/")) {
      url.pathname = `${path}index.html`;
    } else if (!path.split("/").pop()?.includes(".")) {
      url.pathname = `${path}.html`;
    } else {
      return response;
    }

    return env.ASSETS.fetch(new Request(url, request));
  },
};
