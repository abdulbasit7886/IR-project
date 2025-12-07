"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "./component";
import { Footer } from "./component/Footer";
import axios from "axios";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const y = useTransform(scrollY, [0, 500], [0, -100]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Process uploaded file
  const processFile = (file: File) => {
    // Validate file is an image
    if (!file.type.match("image.*")) {
      alert("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size too large. Please select an image under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      // Store the image data in localStorage for the search page
      if (e.target && typeof e.target.result === "string") {
        const formData = new FormData();
        formData.append("image", file);
        const response = await axios.post(
          "http://127.0.0.1:8080/api/search",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        localStorage.setItem("uploadedImage", e.target.result);
        sessionStorage.setItem("responseData", JSON.stringify(response.data));
        router.push("/search");
      }
    };
    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-black" : "bg-white";
  }, [theme]);

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Navigation */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <motion.section
        className={`relative min-h-screen flex flex-col justify-center items-center text-center pt-20 pb-40 transition-colors duration-300`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0 overflow-hidden z-0"
          style={{ y }}
        >
          <div
            className={`absolute inset-0 ${
              theme === "dark"
                ? "bg-gradient-to-b from-blue-900 to-purple-900 opacity-40"
                : "bg-gradient-to-b from-blue-100 to-purple-100"
            }`}
          ></div>
          <svg
            width="100%"
            height="100%"
            className={`absolute inset-0 ${
              theme === "dark" ? "opacity-20" : "opacity-10"
            }`}
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="1"
                  fill={theme === "dark" ? "white" : "#6366F1"}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-8"
            style={{ opacity, y }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Find visually similar images{" "}
            <span
              className={theme === "dark" ? "text-blue-400" : "text-blue-600"}
            >
              instantly
            </span>
            .
          </motion.h1>

          <motion.p
            className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
            style={{ opacity, y }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Upload any image and our AI will find the most similar matches in
            milliseconds. Discover patterns, locate duplicates, or find
            inspiration from lookalikes.
          </motion.p>

          <motion.div
            className={`w-full max-w-lg mx-auto mb-12 border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
              dragActive
                ? theme === "dark"
                  ? "border-blue-400 bg-blue-900 bg-opacity-30"
                  : "border-blue-600 bg-blue-50"
                : theme === "dark"
                ? "border-white border-opacity-30 hover:border-opacity-60"
                : "border-gray-300 hover:border-blue-300"
            }`}
            style={{ opacity, y }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex flex-col items-center justify-center py-12">
              {/* Upload Icon */}
              <motion.div
                className={`${
                  theme === "dark" ? "text-blue-300" : "text-blue-500"
                } mb-6`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </motion.div>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                } text-center mb-6`}
              >
                Drag and drop your image here
                <br />
                or click to browse
              </p>
              <motion.label
                className={`cursor-pointer py-3 px-8 rounded-full text-lg font-medium transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </motion.label>
            </div>
          </motion.div>

          <div className="flex justify-center space-x-2 mt-16 opacity-70">
            <span
              className={`w-2 h-2 rounded-full ${
                theme === "dark" ? "bg-white" : "bg-blue-600"
              }`}
            ></span>
            <span
              className={`w-2 h-2 rounded-full ${
                theme === "dark" ? "bg-white" : "bg-blue-600"
              } opacity-50`}
            ></span>
            <span
              className={`w-2 h-2 rounded-full ${
                theme === "dark" ? "bg-white" : "bg-blue-600"
              } opacity-50`}
            ></span>
          </div>
        </div>

        {/* Orbital animation in background */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
          <motion.div
            className={`absolute w-64 h-64 rounded-full border ${
              theme === "dark" ? "border-white" : "border-blue-400"
            } top-1/4 left-1/4`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          ></motion.div>
          <motion.div
            className={`absolute w-96 h-96 rounded-full border ${
              theme === "dark" ? "border-white" : "border-blue-400"
            } top-1/3 right-1/4`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          ></motion.div>
          <motion.div
            className={`absolute w-32 h-32 rounded-full border ${
              theme === "dark" ? "border-blue-300" : "border-indigo-400"
            } bottom-1/4 left-1/3`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          ></motion.div>
        </div>
      </motion.section>
      <Footer theme={theme} />
    </div>
  );
}
