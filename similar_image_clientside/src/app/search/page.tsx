"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar, useTheme } from "../component";
import Image from "next/image";

interface ImageResult {
  image_base64: string | undefined;
  id: number;
  similarity: number;
  category: string;
  tags: string[];
  image_path: string;
  score: number;
}

export default function Search() {
  const { theme, toggleTheme } = useTheme();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [similarImages, setSimilarImages] = useState<ImageResult[]>([]);
  const [filterOption, setFilterOption] = useState("all");
  const [sortOption, setSortOption] = useState("similarity");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const router = useRouter();

  const resetSearch = () => {
    localStorage.removeItem("uploadedImage");
    router.push("/");
  };

  const getFilteredAndSortedImages = () => {
    const filtered = [...similarImages];

    // Uncomment and implement filtering/sorting if needed
    // if (filterOption !== "all") {
    //   filtered = filtered.filter((img) => img.category === filterOption);
    // }

    // if (sortOption === "similarity") {
    //   filtered.sort((a, b) => b.similarity - a.similarity);
    // } else if (sortOption === "id") {
    //   filtered.sort((a, b) => a.id - b.id);
    // }

    return filtered;
  };

  useEffect(() => {
    const storedImage = localStorage.getItem("uploadedImage");
    const responseData = sessionStorage.getItem("responseData");
    if (responseData) {
      const parsedData = JSON.parse(responseData) as { results: ImageResult[] };
      setSimilarImages(parsedData.results);
    }

    setIsSearching(false);

    if (storedImage) {
      fetch(storedImage)
        .then((res) => res.blob())
        .then((blob) => {
          setUploadedImage(blob as File);
          handleSearch(storedImage);
          setIsSearching(false);
        });
    } else {
      router.push("/");
    }
  }, [router]);

  const handleSearch = (image: string) => {
    if (!image) return;
    setIsSearching(true);
  };

  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-black" : "bg-white";
  }, [theme]);

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        resetSearch={resetSearch}
      />

      <section
        className={`pt-24 pb-20 px-6 transition-colors duration-300 ${
          theme === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        <motion.div
          className="max-w-6xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <div className="relative mx-auto" style={{ maxWidth: "400px" }}>
                <motion.div
                  className={`absolute inset-0 blur-xl opacity-30 rounded-2xl ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
                      : "bg-gradient-to-r from-blue-300 to-purple-300"
                  }`}
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div
                  className={`relative rounded-2xl p-6 shadow-2xl ${
                    theme === "dark" ? "bg-gray-900" : "bg-white"
                  }`}
                >
                  <h2 className="text-2xl font-bold mb-6">Your Image</h2>
                  {uploadedImage && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={URL.createObjectURL(uploadedImage)}
                        alt="Uploaded image"
                        className="w-full h-auto rounded-lg"
                        width={600}
                        height={400}
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className={`w-16 h-16 border-t-4 border-b-4 rounded-full ${
                      theme === "dark" ? "border-blue-400" : "border-blue-600"
                    }`}
                  />
                  <p className="mt-6 text-xl">
                    Analyzing image and finding matches...
                  </p>
                </div>
              ) : (
                <div className="pl-0 md:pl-10">
                  <h2 className="text-3xl font-bold mb-6">Search Results</h2>
                  <p
                    className={`mb-8 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    We analyzed your image and found {similarImages.length}{" "}
                    similar matches. Use the filters below to refine your
                    results.
                  </p>

                  <motion.button
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    className={`w-full py-3 px-6 mb-4 rounded-xl font-medium flex justify-between items-center transition-colors ${
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span>Filter & Sort</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        showFilterPanel ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.button>

                  <AnimatePresence>
                    {showFilterPanel && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`overflow-hidden rounded-xl mb-8 ${
                          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        <div className="p-6">
                          <h3 className="font-medium mb-4">
                            Filter by Category
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {["all", "nature", "urban", "portrait", "food"].map(
                              (category) => (
                                <motion.button
                                  key={category}
                                  onClick={() => setFilterOption(category)}
                                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    filterOption === category
                                      ? "bg-blue-600 text-white"
                                      : theme === "dark"
                                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {category.charAt(0).toUpperCase() +
                                    category.slice(1)}
                                </motion.button>
                              )
                            )}
                          </div>

                          <h3 className="font-medium mb-4">Sort by</h3>
                          <div className="flex gap-2">
                            {["similarity", "id"].map((option) => (
                              <motion.button
                                key={option}
                                onClick={() => setSortOption(option)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                  sortOption === option
                                    ? "bg-blue-600 text-white"
                                    : theme === "dark"
                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {similarImages.length > 0 && !isSearching && (
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-2">Similar Images</h2>
            <p
              className={`mb-12 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We found {getFilteredAndSortedImages().length} image
              {getFilteredAndSortedImages().length !== 1 ? "s" : ""} that match
              your search
              {filterOption !== "all" ? ` in category "${filterOption}"` : ""}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getFilteredAndSortedImages().map((img, index) => (
                <motion.div
                  key={index}
                  className={`rounded-xl overflow-hidden transition-all duration-500 ${
                    theme === "dark" ? "bg-gray-900" : "bg-white shadow-lg"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <motion.img
                      src={img.image_base64}
                      alt={`Similar Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.2 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.7 }}
                    />
                    <motion.div
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full font-medium ${
                        theme === "dark"
                          ? "bg-blue-500 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {img.score}% match
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-xl mb-2">
                      Similar Image {index + 1}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }
                      >
                        Category: {img.category}
                      </span>
                      <motion.button
                        className={`font-medium hover:underline ${
                          theme === "dark"
                            ? "text-blue-400 hover:text-blue-300"
                            : "text-blue-600 hover:text-blue-800"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}

// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { Navbar, useTheme } from "../component";
// import Image from "next/image";

// interface ImageResult {
//   id: number;
//   similarity: number;
//   category: string;
//   tags: string[];
// }

// export default function Search() {
//   const { theme, toggleTheme } = useTheme();
//   const [uploadedImage, setUploadedImage] = useState<any>(null);
//   const [isSearching, setIsSearching] = useState(false);
//   const [similarImages, setSimilarImages] = useState<ImageResult[]>([]);
//   const [filterOption, setFilterOption] = useState("all");
//   const [sortOption, setSortOption] = useState("similarity");
//   const [showFilterPanel, setShowFilterPanel] = useState(false);
//   const router = useRouter();

//   // Reset search and navigate back to home
//   const resetSearch = () => {
//     localStorage.removeItem("uploadedImage");
//     router.push("/");
//   };

//   // Filter and sort images
//   const getFilteredAndSortedImages = () => {
//     let filtered = [...similarImages];

//     // // Apply category filter
//     // if (filterOption !== "all") {
//     //   filtered = filtered.filter((img) => img.category === filterOption);
//     // }

//     // // Apply sorting
//     // if (sortOption === "similarity") {
//     //   filtered.sort((a, b) => b.similarity - a.similarity);
//     // } else if (sortOption === "id") {
//     //   filtered.sort((a, b) => a.id - b.id);
//     // }

//     return filtered;
//   };

//   // Load image from localStorage and start search on mount
//   useEffect(() => {
//     const storedImage = localStorage.getItem("uploadedImage");
//     const responseData: any = sessionStorage.getItem("responseData");
//     setSimilarImages(JSON.parse(responseData).results);
//     setIsSearching(false);

//     if (storedImage) {
//       fetch(storedImage)
//         .then((res) => res.blob())
//         .then((blob: any) => {
//           setUploadedImage(blob);
//           handleSearch(storedImage);
//           setIsSearching(false);
//         });
//     } else {
//       // If no image in storage, redirect to home
//       router.push("/");
//     }
//   }, [router]);
//   // Simulate image search
//   const handleSearch = (image: string) => {
//     if (!image) return;

//     setIsSearching(true);
//     // setSimilarImages([]);
//   };

//   // Apply theme to body
//   useEffect(() => {
//     document.body.className = theme === "dark" ? "bg-black" : "bg-white";
//   }, [theme]);

//   return (
//     <div
//       className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
//         theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"
//       }`}
//     >
//       {/* Navigation */}
//       <Navbar
//         theme={theme}
//         toggleTheme={toggleTheme}
//         resetSearch={resetSearch}
//       />

//       {/* Search Results Section */}
//       <section
//         className={`pt-24 pb-20 px-6 transition-colors duration-300 ${
//           theme === "dark" ? "bg-black" : "bg-white"
//         }`}
//       >
//         {/* Uploaded Image */}
//         <motion.div
//           className="max-w-6xl mx-auto mb-20"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="flex flex-col md:flex-row items-center">
//             <div className="w-full md:w-1/2 mb-10 md:mb-0">
//               <div className="relative mx-auto" style={{ maxWidth: "400px" }}>
//                 <motion.div
//                   className={`absolute inset-0 blur-xl opacity-30 rounded-2xl ${
//                     theme === "dark"
//                       ? "bg-gradient-to-r from-blue-500 to-purple-600"
//                       : "bg-gradient-to-r from-blue-300 to-purple-300"
//                   }`}
//                   animate={{
//                     scale: [1, 1.05, 1],
//                     opacity: [0.3, 0.4, 0.3],
//                   }}
//                   transition={{
//                     duration: 5,
//                     repeat: Infinity,
//                     ease: "easeInOut",
//                   }}
//                 ></motion.div>
//                 <div
//                   className={`relative rounded-2xl p-6 shadow-2xl ${
//                     theme === "dark" ? "bg-gray-900" : "bg-white"
//                   }`}
//                 >
//                   <h2 className="text-2xl font-bold mb-6">Your Image</h2>
//                   {uploadedImage && (
//                     <motion.div
//                       initial={{ scale: 0.95, opacity: 0 }}
//                       animate={{ scale: 1, opacity: 1 }}
//                       transition={{ duration: 0.5 }}
//                     >
//                       <Image
//                         src={URL.createObjectURL(uploadedImage)}
//                         alt="Uploaded image"
//                         className="w-full h-auto rounded-lg"
//                         width={600}
//                         height={400}
//                       />
//                     </motion.div>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="w-full md:w-1/2">
//               {isSearching ? (
//                 <div className="flex flex-col items-center justify-center py-20">
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       ease: "linear",
//                     }}
//                     className={`w-16 h-16 border-t-4 border-b-4 rounded-full ${
//                       theme === "dark" ? "border-blue-400" : "border-blue-600"
//                     }`}
//                   ></motion.div>
//                   <p className="mt-6 text-xl">
//                     Analyzing image and finding matches...
//                   </p>
//                 </div>
//               ) : (
//                 <div className="pl-0 md:pl-10">
//                   <h2 className="text-3xl font-bold mb-6">Search Results</h2>
//                   <p
//                     className={`mb-8 ${
//                       theme === "dark" ? "text-gray-300" : "text-gray-600"
//                     }`}
//                   >
//                     We analyzed your image and found {similarImages.length}{" "}
//                     similar matches. Use the filters below to refine your
//                     results.
//                   </p>

//                   {/* Filter Toggle */}
//                   <motion.button
//                     onClick={() => setShowFilterPanel(!showFilterPanel)}
//                     className={`w-full py-3 px-6 mb-4 rounded-xl font-medium flex justify-between items-center transition-colors ${
//                       theme === "dark"
//                         ? "bg-gray-800 hover:bg-gray-700"
//                         : "bg-gray-200 hover:bg-gray-300"
//                     }`}
//                     whileHover={{ scale: 1.01 }}
//                     whileTap={{ scale: 0.99 }}
//                   >
//                     <span>Filter & Sort</span>
//                     <svg
//                       className={`w-5 h-5 transition-transform duration-300 ${
//                         showFilterPanel ? "rotate-180" : ""
//                       }`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </motion.button>

//                   {/* Filter Panel */}
//                   <AnimatePresence>
//                     {showFilterPanel && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className={`overflow-hidden rounded-xl mb-8 ${
//                           theme === "dark" ? "bg-gray-800" : "bg-gray-100"
//                         }`}
//                       >
//                         <div className="p-6">
//                           <h3 className="font-medium mb-4">
//                             Filter by Category
//                           </h3>
//                           <div className="flex flex-wrap gap-2 mb-6">
//                             {["all", "nature", "urban", "portrait", "food"].map(
//                               (category) => (
//                                 <motion.button
//                                   key={category}
//                                   onClick={() => setFilterOption(category)}
//                                   className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//                                     filterOption === category
//                                       ? theme === "dark"
//                                         ? "bg-blue-600 text-white"
//                                         : "bg-blue-600 text-white"
//                                       : theme === "dark"
//                                       ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                                   }`}
//                                   whileHover={{ scale: 1.05 }}
//                                   whileTap={{ scale: 0.95 }}
//                                 >
//                                   {category.charAt(0).toUpperCase() +
//                                     category.slice(1)}
//                                 </motion.button>
//                               )
//                             )}
//                           </div>

//                           <h3 className="font-medium mb-4">Sort by</h3>
//                           <div className="flex gap-2">
//                             <motion.button
//                               onClick={() => setSortOption("similarity")}
//                               className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//                                 sortOption === "similarity"
//                                   ? theme === "dark"
//                                     ? "bg-blue-600 text-white"
//                                     : "bg-blue-600 text-white"
//                                   : theme === "dark"
//                                   ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                               }`}
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                             >
//                               Similarity
//                             </motion.button>
//                             <motion.button
//                               onClick={() => setSortOption("id")}
//                               className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//                                 sortOption === "id"
//                                   ? theme === "dark"
//                                     ? "bg-blue-600 text-white"
//                                     : "bg-blue-600 text-white"
//                                   : theme === "dark"
//                                   ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                               }`}
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                             >
//                               ID
//                             </motion.button>
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               )}
//             </div>
//           </div>
//         </motion.div>

//         {/* Similar Images Results */}
//         {similarImages.length > 0 && !isSearching && (
//           <motion.div
//             className="max-w-6xl mx-auto"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             <h2 className="text-3xl font-bold mb-2">Similar Images</h2>
//             <p
//               className={`mb-12 ${
//                 theme === "dark" ? "text-gray-400" : "text-gray-600"
//               }`}
//             >
//               We found {getFilteredAndSortedImages().length} image
//               {getFilteredAndSortedImages().length !== 1 ? "s" : ""} that match
//               your search
//               {filterOption !== "all" ? ` in category "${filterOption}"` : ""}
//             </p>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {getFilteredAndSortedImages().map((img: any, index) => (
//                 <motion.div
//                   key={index}
//                   className={`rounded-xl overflow-hidden transition-all duration-500 ${
//                     theme === "dark" ? "bg-gray-900" : "bg-white shadow-lg"
//                   }`}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4, delay: index * 0.1 }}
//                   whileHover={{
//                     scale: 1.03,
//                     boxShadow:
//                       theme === "dark"
//                         ? "0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6)"
//                         : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//                   }}
//                 >
//                   <div className="relative h-56 overflow-hidden">
//                     <motion.div
//                       className="w-full h-full bg-gray-300"
//                       initial={{ scale: 1.2 }}
//                       whileHover={{ scale: 1 }}
//                       transition={{ duration: 0.7 }}
//                     >
//                       <motion.img
//                         src={img?.image_path}
//                         alt={`Similar Image ${index + 1}`}
//                         className="w-full h-full object-cover"
//                         initial={{ scale: 1.2 }}
//                         whileHover={{ scale: 1 }}
//                         transition={{ duration: 0.7 }}
//                       />
//                     </motion.div>
//                     <motion.div
//                       className={`absolute top-4 right-4 px-3 py-1 rounded-full font-medium ${
//                         theme === "dark"
//                           ? "bg-blue-500 text-white"
//                           : "bg-blue-600 text-white"
//                       }`}
//                       whileHover={{ scale: 1.1 }}
//                     >
//                       {img.score}% match
//                     </motion.div>
//                   </div>
//                   <div className="p-6">
//                     <h3 className="font-medium text-xl mb-2">
//                       Similar Image {index + 1}
//                     </h3>
//                     {/* <div className="flex flex-wrap gap-2 mb-3">
//                       {img.tags.map((tag) => (
//                         <motion.span
//                           key={tag}
//                           className={`text-xs px-2 py-1 rounded-full ${
//                             theme === "dark"
//                               ? "bg-gray-800 text-gray-300"
//                               : "bg-gray-200 text-gray-700"
//                           }`}
//                           whileHover={{
//                             scale: 1.1,
//                             backgroundColor:
//                               theme === "dark" ? "#374151" : "#E5E7EB",
//                           }}
//                         >
//                           #{tag}
//                         </motion.span>
//                       ))}
//                     </div> */}
//                     <div className="flex items-center justify-between mt-2">
//                       <span
//                         className={
//                           theme === "dark" ? "text-gray-400" : "text-gray-500"
//                         }
//                       >
//                         Category: {"person"}
//                       </span>
//                       <motion.button
//                         className={`font-medium hover:underline ${
//                           theme === "dark"
//                             ? "text-blue-400 hover:text-blue-300"
//                             : "text-blue-600 hover:text-blue-800"
//                         }`}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         View Details
//                       </motion.button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Empty State */}
//             {getFilteredAndSortedImages().length === 0 && (
//               <motion.div
//                 className={`text-center py-16 rounded-xl ${
//                   theme === "dark" ? "bg-gray-900" : "bg-gray-100"
//                 }`}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <motion.svg
//                   className={`w-16 h-16 mx-auto mb-4 ${
//                     theme === "dark" ? "text-gray-700" : "text-gray-400"
//                   }`}
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.5"
//                   animate={{
//                     rotate: [0, 5, -5, 0],
//                     scale: [1, 1.05, 0.95, 1],
//                   }}
//                   transition={{
//                     duration: 4,
//                     repeat: Infinity,
//                     ease: "easeInOut",
//                   }}
//                 >
//                   <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
//                   <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
//                 </motion.svg>
//                 <h3 className="text-xl font-medium mb-2">
//                   No matching images found
//                 </h3>
//                 <p
//                   className={`${
//                     theme === "dark" ? "text-gray-400" : "text-gray-600"
//                   }`}
//                 >
//                   Try adjusting your filter settings or upload a different image
//                 </p>
//               </motion.div>
//             )}

//             {/* Load More Button */}
//             {getFilteredAndSortedImages().length > 0 && (
//               <div className="mt-16 text-center">
//                 <motion.button
//                   className={`px-8 py-3 rounded-full text-lg font-medium transition-colors ${
//                     theme === "dark"
//                       ? "bg-gray-800 hover:bg-gray-700 text-white"
//                       : "bg-gray-200 hover:bg-gray-300 text-gray-900"
//                   }`}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Load More Results
//                 </motion.button>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </section>

//       {/* Footer */}
//       <footer
//         className={`py-16 px-6 ${
//           theme === "dark" ? "bg-gray-900" : "bg-gray-100"
//         }`}
//       >
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
//             <div>
//               <div className="flex items-center space-x-2 mb-6">
//                 <svg
//                   className={`w-6 h-6 ${
//                     theme === "dark" ? "text-white" : "text-blue-600"
//                   }`}
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <circle cx="12" cy="12" r="10" />
//                   <path d="M8 12h8" />
//                   <path d="M12 8v8" />
//                 </svg>
//                 <span className="font-bold text-xl">ImageMatch</span>
//               </div>
//               <p
//                 className={`${
//                   theme === "dark" ? "text-gray-400" : "text-gray-600"
//                 } mb-6`}
//               >
//                 Cutting-edge AI technology to find visually similar images
//                 instantly.
//               </p>
//               <div className="flex space-x-4">
//                 <motion.a
//                   href="#"
//                   className={`${
//                     theme === "dark"
//                       ? "text-gray-300 hover:text-white"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                   whileHover={{ scale: 1.1, rotate: 5 }}
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
//                   </svg>
//                 </motion.a>
//                 <motion.a
//                   href="#"
//                   className={`${
//                     theme === "dark"
//                       ? "text-gray-300 hover:text-white"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                   whileHover={{ scale: 1.1, rotate: -5 }}
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
//                   </svg>
//                 </motion.a>
//                 <motion.a
//                   href="#"
//                   className={`${
//                     theme === "dark"
//                       ? "text-gray-300 hover:text-white"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                   whileHover={{ scale: 1.1, rotate: 5 }}
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
//                   </svg>
//                 </motion.a>
//               </div>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-4">Product</h3>
//               <ul className="space-y-2">
//                 <motion.li whileHover={{ x: 5 }}>
//                   <a
//                     href="#"
//                     className={
//                       theme === "dark"
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }
//                   >
//                     Features
//                   </a>
//                 </motion.li>
//                 <motion.li whileHover={{ x: 5 }}>
//                   <a
//                     href="#"
//                     className={
//                       theme === "dark"
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }
//                   >
//                     Pricing
//                   </a>
//                 </motion.li>
//                 <motion.li whileHover={{ x: 5 }}>
//                   <a
//                     href="#"
//                     className={
//                       theme === "dark"
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }
//                   >
//                     API
//                   </a>
//                 </motion.li>
//                 <motion.li whileHover={{ x: 5 }}>
//                   <a
//                     href="#"
//                     className={
//                       theme === "dark"
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }
//                   >
//                     Integrations
//                   </a>
//                 </motion.li>
//               </ul>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-4">Resources</h3>
//               <ul className="space-y-2">
//                 <motion.li whileHover={{ x: 5 }}>
//                   <a
//                     href="#"
//                     className={
//                       theme === "dark"
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }
//                   >
//                     Documentation
//                   </a>
//                 </motion.li>
//                 <motion.li whileHover={{ x: 5 }}>
//                   <a
//                     href="#"
//                     className={
//                       theme === "dark"
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }
//                   >
//                     Guides
//                   </a>
//                 </motion.li>
//                 <motion.li whileHover={{ x: 5 }}>
//                   <a
//                     href="#"
//                     className={
//                       theme === "dark"
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }
//                   >
//                     Blog
//                   </a>
//                 </motion.li>
//                 <motion.li whileHover={{ x: 5 }}>
//                   <a
//                     href="#"
//                     className={
//                       theme === "dark"
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }
//                   >
//                     Support
//                   </a>
//                 </motion.li>
//               </ul>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-4">Company</h3>
//               <ul className="space-y-2">
//                 <motion.li whileHover={{ x: 5 }}>
//                   <a
//                     href="#"
//                     className={
//                       theme === "dark"
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }
//                   >
//                     About
//                   </a>
//                 </motion.li>
//                 <motion.li whileHover={{ x: 5 }}>
//                   <a
//                     href="#"
//                     className={
//                       theme === "dark"
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }
//                   >
//                     Careers
//                   </a>
//                 </motion.li>
//                 <motion.li whileHover={{ x: 5 }}>
//                   <a
//                     href="#"
//                     className={
//                       theme === "dark"
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }
//                   >
//                     Privacy
//                   </a>
//                 </motion.li>
//                 <motion.li whileHover={{ x: 5 }}>
//                   <a
//                     href="#"
//                     className={
//                       theme === "dark"
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }
//                   >
//                     Terms
//                   </a>
//                 </motion.li>
//               </ul>
//             </div>
//           </div>

//           <div className="mt-12 pt-8 border-t border-gray-800 text-center">
//             <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
//               © 2023 ImageMatch. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
