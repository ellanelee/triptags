import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export default function HomeView() {
  //next-intl, message에서 locale에 관련된 항목을 추출
  const tr = useTranslations("HomePage")

  //시작화면 구성
  return (
    <main className="relative min-h-screen">
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=2000')`,
        }}
      >
        {/*Gradient*/}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
        {/*Main 문구*/}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
            {tr("title")}
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/95 drop-shadow-lg max-w-3xl mx-auto">
            {tr("description")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              href="/venues"
              className="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-all hover:scale-105 shadow-xl"
            >
              {tr("exploreVenues")}
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white/95 text-primary-600 text-lg font-semibold rounded-lg hover:bg-white transition-all hover:scale-105 shadow-xl"
            >
              {tr("getStarted")}
            </Link>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-4 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Local Section */}
            <div className="group p-8 bg-white border-2 border-local-500/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-local-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-local-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-local-600 mb-4">
                {tr("localSection.title")}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {tr("localSection.description")}
              </p>
            </div>

            {/* Traveler Section */}
            <div className="group p-8 bg-white border-2 border-traveler-500/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-traveler-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-traveler-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-traveler-600 mb-4">
                {tr("travelerSection.title")}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {tr("travelerSection.description")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
