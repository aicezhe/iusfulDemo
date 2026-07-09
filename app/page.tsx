import UploadWizard from "@/components/UploadWizard";

// Force this page to render fresh on every request instead of being served
// from Next.js/Vercel's static prerender cache (independent of the
// Cache-Control headers in next.config.ts, which only govern the browser).
// That prerender cache is what was serving stale HTML — referencing JS
// chunks an older deploy had already removed — for a window after each
// deploy, which is what caused the white screen.
export const dynamic = "force-dynamic";

export default function Home() {
  return <UploadWizard />;
}
