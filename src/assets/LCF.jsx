import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  easy: ["#34d399", "#1f2937"],
  medium: ["#fbbf24", "#1f2937"],
  hard: ["#ef4444", "#1f2937"],
};

const LCF = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `https://leetcode-stats-api.herokuapp.com/${username}`;
      let data = await fetch(url);
      let json = await data.json();

      if (json.status === "error") {
        setError("⚠️ User not found");
        setUserData(null);
      } else {
        setUserData(json);
        setError(null);
      }
    } catch (err) {
      setError("❌ Failed to fetch data");
      setUserData(null);
    }
    setLoading(false);
  };

  const renderChart = (label, solved, total, colors) => {
    const chartData = [
      { name: "Solved", value: solved },
      { name: "Remaining", value: total - solved },
    ];

    return (
      <div className="flex-1 min-w-[250px] max-w-sm p-4">
        <h2 className="text-base sm:text-lg font-semibold text-center mb-2 text-gray-200">
          {label}
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              outerRadius={70}
              innerRadius={35}
              label={({ name, value }) => (name === "Solved" ? value : "")}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                color: "#f9fafb",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-center text-sm sm:text-base text-gray-400">
          {solved}/{total} solved
        </p>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-[95%] sm:w-[85%] lg:w-[65%] mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl space-y-6 text-gray-100">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-purple-400">
        ⚡ LeetCode Stats
      </h1>

      <div className="flex flex-col sm:flex-row justify-center sm:space-x-3 space-y-3 sm:space-y-0 p-4">
        <input
          type="text"
          className="bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg w-full sm:w-[70%] max-w-full shadow text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter LeetCode username"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchData();
            }
          }}
        />
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow transition sm:w-auto w-full"
          onClick={fetchData}
        >
          Fetch
        </button>
      </div>

      {loading && (
        <p className="text-center text-gray-400 animate-pulse">Fetching data...</p>
      )}
      {error && <p className="text-red-400 text-center font-medium">{error}</p>}

      {userData && (
        <div className="space-y-6">
          <div className="bg-gray-800 shadow-md rounded-lg p-4 text-center">
            <p className="text-lg sm:text-xl font-semibold text-gray-200">
              Total Problems Solved:{" "}
              <span className="text-purple-400">{userData.totalSolved}</span>
            </p>
            <p className="text-base sm:text-lg text-gray-400">
              Ranking:{" "}
              <span className="text-blue-400 font-medium">#{userData.ranking}</span>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 bg-gray-800 rounded-lg shadow-md p-4">
            {renderChart("Easy", userData.easySolved, userData.totalEasy, COLORS.easy)}
            {renderChart("Medium", userData.mediumSolved, userData.totalMedium, COLORS.medium)}
            {renderChart("Hard", userData.hardSolved, userData.totalHard, COLORS.hard)}
          </div>
        </div>
      )}
    </div>
  );
};

export default LCF;
