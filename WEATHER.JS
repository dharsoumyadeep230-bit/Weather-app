const API_KEY = "f51313d82775451d99d94216251709";
const API_URL = "http://api.weatherapi.com/v1/current.json";

const btn = document.getElementById("getWeatherBtn");
const input = document.getElementById("locationInput");
const weatherInfo = document.getElementById("weatherInfo");

// 🌞🌙 Set theme based on local time
function setThemeByLocalHour() {
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 18;
  document.body.classList.toggle("day", isDay);
  document.body.classList.toggle("night", !isDay);
}
setThemeByLocalHour();

btn.addEventListener("click", async () => {
  const location = input.value.trim();
  if (!location) {
    weatherInfo.innerHTML = `<div class="error">⚠️ Please enter a location.</div>`;
    return;
  }

  btn.disabled = true;
  btn.textContent = "Loading...";

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}&q=${location}&aqi=yes`);
    if (!response.ok) throw new Error("Failed to fetch weather");

    const data = await response.json();

    // Update theme based on city’s localtime
    if (data.current.is_day === 1) {
      document.body.classList.add("day");
      document.body.classList.remove("night");
    } else {
      document.body.classList.add("night");
      document.body.classList.remove("day");
    }

    weatherInfo.innerHTML = `
      <div class="card">
        <div class="left">
          <div class="temp">${data.current.temp_c}°C</div>
          <div class="condition">${data.current.condition.text}</div>
          <div class="meta">
            <span>🌬 ${data.current.wind_kph} kph</span>
            <span>💧 ${data.current.humidity}%</span>
            <span>🌡 Feels like ${data.current.feelslike_c}°C</span>
          </div>
        </div>
        <img class="icon" src="https:${data.current.condition.icon}" alt="Weather icon">
      </div>
    `;
  } catch (err) {
    weatherInfo.innerHTML = `<div class="error">❌ ${err.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Get Weather";
  }
});
