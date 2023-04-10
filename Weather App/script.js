const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nove', 'Dec']

const API_KEY = 'd1bef719baa3fbab09f45087f3d64c9a';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    timeEl.innerHTML = (hour < 10 ? '0' + hour:hour) + ':' + (minutes < 10 ? '0' + minutes:minutes)

    dateEl.innerHTML = days[day] + ', ' + date + ' '+ months[month]
}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {

        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`).then(res=>res.json()).then(data=>{
            console.log(data);
            showWeatherData(data);
        })
    })
}

function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+ 'E'

    var unix = new Date(sunrise*1000);
    var unix2 = new Date(sunset*1000);
    currentWeatherItemsEl.innerHTML =
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${unix.toLocaleTimeString("it-IT")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${unix2.toLocaleTimeString("it-IT")}</div>
    </div>`;

    let otherDayForecast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){

            currentTempEl.innerHTML = `
            <div class="today" id="current-temp">
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">Today</div>
                    <div class="temp">Night: ${day.temp.night}&#176; C</div>
                    <div class="temp">Day: ${day.temp.day}&#176; C</div>
                </div>
            </div>
            
            `
        }else{
            var dd = new Date(day.dt * 1000)
            otherDayForecast +=`
            <div class="weather-forecast-item">
                <div class="day">${dd.toLocaleDateString("it-IT")}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night: ${day.temp.night}&#176; C</div>
                <div class="temp">Day: ${day.temp.day}&#176; C</div>
            </div>
            
            `
        }
    })

    weatherForecastEl.innerHTML = otherDayForecast;
}