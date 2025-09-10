import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl dark:text-white">
            Find Your
            <span className="block text-blue-600 dark:text-blue-400">
              Perfect Fit
            </span>
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
            AI-powered size recommendations that take the guesswork out of
            online shopping. Get personalized fit suggestions based on your
            measurements and preferences.
          </p>

          {/* CTA Buttons - Matching your design */}
          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/fit"
              className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-blue-700 hover:shadow-xl"
            >
              Find Your Size
            </Link>
            <Link
              href="/find"
              className="rounded-lg border-2 border-blue-600 px-8 py-3 text-lg font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white"
            >
              Find Similar
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-gray-800">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Smart Sizing
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              AI analyzes your measurements and provides accurate size
              recommendations
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-gray-800">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Product Discovery
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Find products that match your style and fit preferences
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-gray-800">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Instant Results
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get personalized recommendations in seconds, not hours
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 text-center">
          <h2 className="mb-12 text-3xl font-bold text-gray-900 dark:text-white">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Input Your Measurements
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your height, weight, and body measurements
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                AI Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI processes your data and preferences
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Get Recommendations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive personalized size and product suggestions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
