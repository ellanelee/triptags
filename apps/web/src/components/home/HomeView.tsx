import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export default function HomeView() {
  //next-intl, message에서 locale에 관련된 항목을 추출 
  const tr = useTranslations('HomePage')
  
  //로그인 상태에서 보여줄 component구성 

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

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <svg
            className="w-6 h-6 text-white/80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>
    </main>
  )
}
