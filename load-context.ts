import { AppLoadContext } from "@remix-run/cloudflare";
import { type PlatformProxy } from "wrangler";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    extra: string;
  }
}

type GetLoadContext = (args: {
  request: Request;
  context: { cloudflare: Cloudflare };
}) => Promise<AppLoadContext>;

export const getLoadContext: GetLoadContext = async ({ context, request }) => {
  const url = await request.url;
  return {
    ...context,
    extra: url,
  };
};
