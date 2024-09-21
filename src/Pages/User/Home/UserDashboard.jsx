import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LineChart, BarChart, PieChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, Pie, Cell, ResponsiveContainer, CartesianGrid } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { set_user_basic_details } from "../../../Redux/UserDetails/UserDetailsSlice";
import { CloudRain, Droplets, Sun, Wind } from "lucide-react";

export default function Dashboard() {
  const [chartType, setChartType] = useState("line");
  const [weatherData, setWeatherData] = useState([]);
  const [todayWeather, setTodayWeather] = useState({});
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

        const forecast = response.data.forecast.forecastday;
        const formattedData = forecast.map((day) => ({
          day: day.date,
          temp: day.day.avgtemp_c,
          humidity: day.day.avghumidity,
          precipitation: day.day.totalprecip_mm,
        }));

        setWeatherData(formattedData);
        setTodayWeather({
          temperature: forecast[0].day.avgtemp_c,
          condition: forecast[0].day.condition.text,
          humidity: forecast[0].day.avghumidity,
          windSpeed: forecast[0].day.maxwind_kph,
          uvIndex: forecast[0].day.uv,
          precipitation: forecast[0].day.totalprecip_mm,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
    console.log("userdetails", userdetails);
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  const handleLogout = () => {
    localStorage.clear();
    dispatch(
      set_user_basic_details({
        id: null,
        name: null,
        email: null,
        is_superuser: false,
        is_authenticated: false,
      })
    );

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-black text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold ml-10">Weather Dashboard</h1>

        <div className="flex items-center space-x-4">
          <div className="relative inline-block">
          
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
            aria-label="Logout"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4">
  <h1 className="text-4xl font-bold mb-8 text-center">Weather Forecast</h1>

 
    <div className="col-span-2 bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold">Today's Weather</h2>
      <p className="text-gray-500">Current conditions and details</p>
      <div className="flex items-center justify-between mt-4">
        <div className="text-6xl font-bold">{todayWeather.temperature}°C</div>
        <div className="text-2xl">{todayWeather.condition}</div>
        <Sun className="w-16 h-16 text-yellow-400" />
      </div>
    </div>

    {/* Weather Info Cards */}

<div className="grid grid-cols-2 gap-4 lg:grid-cols-[1fr_1fr] mt-5">
  <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
    <h3 className="text-sm font-medium">Humidity</h3>
    <Droplets className="h-6 w-6 text-muted-foreground" />
    <div className="text-2xl font-bold">{todayWeather.humidity}%</div>
  </div>
  <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
    <h3 className="text-sm font-medium">Wind Speed</h3>
    <Wind className="h-6 w-6 text-muted-foreground" />
    <div className="text-2xl font-bold">{todayWeather.windSpeed} km/h</div>
  </div>
  <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
    <h3 className="text-sm font-medium">UV Index</h3>
    <Sun className="h-6 w-6 text-muted-foreground" />
    <div className="text-2xl font-bold">{todayWeather.uvIndex}</div>
  </div>
  <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
    <h3 className="text-sm font-medium">Precipitation</h3>
    <CloudRain className="h-6 w-6 text-muted-foreground" />
    <div className="text-2xl font-bold">{todayWeather.precipitation} mm</div>
  </div>
</div>


  {/* Chart Section */}
  <main className="p-8 bg-white shadow-lg rounded-lg mt-8 mx-auto" style={{ width: '100%', height: 'auto' }}>
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-semibold mb-6 text-gray-700">
      {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
    </h2>

    <select
      className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer focus:outline-none ml-auto"
      value={chartType}
      onChange={(e) => setChartType(e.target.value)}
    >
      <option value="line">Line Chart</option>
      <option value="bar">Bar Chart</option>
      <option value="pie">Pie Chart</option>
    </select>
  </div>

  {/* Chart Implementation */}
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

  {/* Other Charts */}
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

  {chartType === "pie" && (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={[
            { name: "Average Temperature (°C)", value: weatherData.reduce((sum, data) => sum + data.temp, 0) / weatherData.length || 0 },
            { name: "Average Humidity (%)", value: weatherData.reduce((sum, data) => sum + data.humidity, 0) / weatherData.length || 0 },
            { name: "Total Precipitation (mm)", value: weatherData.reduce((sum, data) => sum + data.precipitation, 0) || 0 },
          ]}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          label
        >
          {COLORS.map((color, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )}
</main>

</div>

    </div>
  );
}

