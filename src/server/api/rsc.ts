import {
  HTTPHeaders,
  createTRPCProxyClient,
  httpBatchLink,
} from "@trpc/client";
import { headers } from "next/headers";
import { clientOptions, getBaseUrl } from "./client";

// Replace ending link with a link that passes the headers form RSC
const links = clientOptions.links
  .slice(0, clientOptions.links.length - 2)
  .concat([
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        const h: HTTPHeaders = {
          rsc: "1",
        };
        for (const [key, value] of headers()) {
          h[key] = value;
        }
        delete h.connection;
        return h;
      },
    }),
  ]);
export const trpc = createTRPCProxyClient({
  ...clientOptions,
  links,
});
