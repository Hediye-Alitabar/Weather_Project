import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Images
let weatherPhotos = {
  partlyCloudy: "./Images/partlyCloudy.png",
  rainDrop: "./Images/rainDrop.png",
  shower: "./Images/shower.png",
  snow: "./Images/snow.png",
  storm: "./Images/storm.png",
  Clear: "./Images/Clear.png",
};

function weatherImage(weather) {
  switch (weather) {
    case "Clear":
      return weatherPhotos.Clear;
    case "Clouds":
      return weatherPhotos.partlyCloudy;
    case "Rain":
      return weatherPhotos.rainDrop;
    case "Shower":
      return weatherPhotos.shower;
    case "Snow":
      return weatherPhotos.snow;
    case "Storm":
      return weatherPhotos.storm;
    default:
      return "";
  }
}

// Descriptions
const descToPersian = {
  clearSky: "هوای صاف",
  lightRain: "باران ملایم",
  scatteredClouds: "ابرهای پراکنده",
  fewClouds: "کمی ابری",
  overcastClouds: "بسیار ابری",
};

function weatherDesc(weather) {
  switch (weather) {
    case "clear sky":
      return descToPersian.clearSky;
    case "light rain":
      return descToPersian.lightRain;
    case "scattered clouds":
      return descToPersian.scatteredClouds;
    case "few clouds":
      return descToPersian.fewClouds;
    case "overcast clouds":
      return descToPersian.overcastClouds;
    default:
      return "";
  }
}

function toPersianNumber(number) {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return number.toString().replace(/\d/g, (d) => persianDigits[d]);
}
function theme() {
  const hour = new Date().getHours();
  const body = document.body;

  if (hour >= 18 || hour < 6) {
    body.classList.add("dark-mode");
  } else {
    body.classList.add("body");
  }
}

theme();
setInterval(theme, 60 * 60 * 1000);

export default function Home() {
  const [weather, setWeather] = useState([]);
  const [todayData, setTodayData] = useState(null);
  const [city, setCity] = useState("تهران");
  const [todayDate, setTodayDate] = useState("");

  const loadWeather = async () => {
    try {
      const res = await axios.get(
        "https://api.dastyar.io/express/weather?lat=35.67194277&lng=51.42434403"
      );
      const data = res.data;
      setWeather(data);
      const today = data.find((item) => item.dateTitle == "امروز");
      setTodayData(today);

      const todayDate = new Date(today.date);
      const options = { weekday: "long", month: "long", day: "numeric" };
      setTodayDate(todayDate.toLocaleDateString("fa-IR", options));
    } catch (error) {
      console.error("There was a problem fetching the data:", error);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  return (
    <div>
      <link rel="stylesheet" href="Home.CSS"></link>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      ></link>

      <div className="main">
        <div id="header">
          <span>
            {city}{" "}
            <i
              className="fas fa-map-marker-alt"
            ></i>
          </span>
          {todayDate && (
            <div>
              <p>{todayDate}</p>
            </div>
          )}
        </div>
        <div className="middle">
          <div id="today">
            {todayData && (
              <div className="today-weather">
                <div className="today_icon">
                  <img
                    src={weatherImage(todayData.weather.main)}
                    alt="weather icon"
                  />
                </div>
                <h2>
                  {toPersianNumber(parseFloat(todayData.current).toFixed(0))}
                  <sup>°</sup>
                </h2>
                <div>
                  <p>
                    <strong>
                      {weatherDesc(todayData.weather.description)}
                    </strong>
                  </p>
                </div>
                <div className="today_temp">
                  <span>
                    {toPersianNumber(parseFloat(todayData.min).toFixed(0))}
                    <sup>°</sup> حداقل
                  </span>
                  <span>
                    {toPersianNumber(parseFloat(todayData.max).toFixed(0))}
                    <sup>°</sup> حداکثر
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="container">
            <p className="container-header"
              // style={{
              //   display: "flex",
              //   flexDirection: "row-reverse",
              //   margin: "20px",
              // }}
            >
              <i
                className="far fa-calendar-alt"
              ></i>
              پیش بینی روزهای آینده
            </p>
            <div id="weather-container">
              {weather
                .filter((item) => item.dateTitle !== "امروز")
                .map((item) => (
                  <div className="weather-card" key={item.date}>
                    <span className="date-title">
                      {new Date(item.date).toLocaleDateString("fa-IR", {
                        weekday: "long",
                      })}
                    </span>
                    <span className="icon">
                      <img
                        src={weatherImage(item.weather.main)}
                        alt="weather icon"
                      />
                    </span>
                    <div className="temp">
                      <span>
                        {toPersianNumber(parseFloat(item.min).toFixed(0))}
                        <sup>°</sup> حداقل
                      </span>
                      <span>
                        {toPersianNumber(parseFloat(item.max).toFixed(0))}
                        <sup>°</sup> حداکثر
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
