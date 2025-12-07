"use client";

import React from "react";

export default function TestCSS() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Tailwind CSS Test
      </h1>
      <p className="text-gray-700 mb-2">
        This is a paragraph with Tailwind styling.
      </p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Test Button
      </button>
      <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
        This is a red alert box
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-green-200 p-4 rounded">Grid Item 1</div>
        <div className="bg-yellow-200 p-4 rounded">Grid Item 2</div>
        <div className="bg-purple-200 p-4 rounded">Grid Item 3</div>
      </div>
    </div>
  );
}
