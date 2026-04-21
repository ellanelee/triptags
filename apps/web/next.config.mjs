/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin"
const ALLOWED_IMAGE_DOMAINS = [
  "search.pstatic.net",
  "ldb-phinf.pstatic.net",
  "maps.googleapis.com",
  "images.unsplash.com",
  "tong.visitkorea.or.kr",
]

const nextConfig = {
  images: {
    remotePatterns: [
      ...ALLOWED_IMAGE_DOMAINS.map((domain) => ({
        protocol: "https",
        hostname: domain,
        pathname: "/**",
      })),
      { protocol: "http", hostname: "tong.visitkorea.or.kr", pathname: "/**" },
    ],
  },
}

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")
export default withNextIntl(nextConfig)
