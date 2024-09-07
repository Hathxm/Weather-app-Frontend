import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LineChart, BarChart, PieChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, Pie, Cell, ResponsiveContainer } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { set_user_basic_details } from "../../../Redux/UserDetails/UserDetailsSlice";

export default function Dashboard() {
  const [chartType, setChartType] = useState("line");
  const [weatherData, setWeatherData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userdetails = useSelector(state => state.user_basic_details);


  const API_KEY = "7ee0d9af2d1b4f4e90625730240609";
  const location = "India";

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json`, {
          params: {
            key: API_KEY,
            q: location,
            days: 14,
            aqi: "no",
          },
        });

        const formattedData = response.data.forecast.forecastday.map((day) => ({
          day: day.date,
          temp: day.day.avgtemp_c,
          humidity: day.day.avghumidity,
          precipitation: day.day.totalprecip_mm,
        }));

        setWeatherData(formattedData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
    console.log("userdetails",userdetails)
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    dispatch(
        set_user_basic_details({
            id : null,
            name: null,
            email:null,
            is_superuser:false,
            is_authenticated:false,
        })
    )


    // Navigate to login page
    navigate("/login");
  };

  const ChevronDownIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-black text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Weather Dashboard</h1>

        <div className="flex items-center space-x-4">
          <div className="relative inline-block">
            <select
              className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer focus:outline-none"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
            aria-label="Logout"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </header>
      
      <div className="text-center mt-2">
        <h3 className="text-xl font-semi-bold">Weather Forecast For The Next 14 Days :</h3>
      </div>

      {/* Main content */}
      <main className="flex-grow p-8 bg-white shadow-lg rounded-lg mt-4 mx-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
        </h2>

        {/* Line Chart */}
        {chartType === "line" && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={weatherData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temp" stroke="#8884d8" name="Temperature (°C)" />
              <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidity (%)" />
              <Line type="monotone" dataKey="precipitation" stroke="#ffc658" name="Precipitation (mm)" />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Bar Chart */}
        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={weatherData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="temp" fill="#8884d8" name="Temperature (°C)" />
              <Bar dataKey="humidity" fill="#82ca9d" name="Humidity (%)" />
              <Bar dataKey="precipitation" fill="#ffc658" name="Precipitation (mm)" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Pie Chart */}
        {chartType === "pie" && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={[
                  { name: "Average Temperature (°C)", value: weatherData.reduce((sum, data) => sum + data.temp, 0) / weatherData.length || 0 },
                  { name: "Average Humidity (%)", value: weatherData.reduce((sum, data) => sum + data.humidity, 0) / weatherData.length || 0 },
                  { name: "Total Precipitation (mm)", value: weatherData.reduce((sum, data) => sum + data.precipitation, 0) || 0 },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </main>
    </div>
  );
}
