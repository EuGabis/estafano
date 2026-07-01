/**
 * Em hosts estáticos (ex.: GitHub Pages) rode com STATIC_EXPORT=true para
 * gerar a pasta ./out. Na Vercel deixe sem a variável: ela hospeda o Next
 * nativamente e as páginas (todas estáticas) são servidas como estáticas.
 *
 * @type {import('next').NextConfig}
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig = {
  ...(isStaticExport ? { output: "export" } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
