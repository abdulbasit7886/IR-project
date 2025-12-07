export default function TailwindTest() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="mb-6 text-center text-4xl font-bold text-blue-600">
          Tailwind CSS Test
        </h1>

        {/* Card */}
        <div className="mx-auto mb-8 max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
          <div className="md:flex">
            <div className="md:shrink-0">
              <div className="h-48 w-full bg-gradient-to-r from-blue-500 to-purple-500 md:h-full md:w-48"></div>
            </div>
            <div className="p-8">
              <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
                Card Component
              </div>
              <h2 className="mt-1 text-xl font-medium text-gray-800">
                This is a card component
              </h2>
              <p className="mt-2 text-gray-500">
                If you can see this styled properly, Tailwind CSS is working!
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Primary Button
          </button>
          <button className="rounded bg-gray-200 px-4 py-2 font-bold text-gray-700 hover:bg-gray-300">
            Secondary Button
          </button>
          <button className="rounded border border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 hover:bg-gray-100">
            Tertiary Button
          </button>
        </div>

        {/* Alert */}
        <div className="mt-8 rounded-lg bg-red-100 p-4 text-red-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                If this alert box is properly styled, Tailwind CSS is working!
              </p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-xl font-bold text-gray-800">Feature 1</h3>
            <p className="text-gray-600">
              This is a feature card styled with Tailwind.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-xl font-bold text-gray-800">Feature 2</h3>
            <p className="text-gray-600">
              This is a feature card styled with Tailwind.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-xl font-bold text-gray-800">Feature 3</h3>
            <p className="text-gray-600">
              This is a feature card styled with Tailwind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
