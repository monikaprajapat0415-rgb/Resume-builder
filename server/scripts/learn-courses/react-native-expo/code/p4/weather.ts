export type Weather = {
  city: string;
  country: string;
  temperature: number;
  windSpeed: number;
  description: string;
};

const CODES: Record<number, string> = {
  0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Fog", 51: "Light drizzle", 61: "Rain", 63: "Rain", 65: "Heavy rain",
  71: "Snow", 80: "Rain showers", 95: "Thunderstorm",
};

export const describe = (code: number) => CODES[code] ?? "Unknown";

export async function fetchWeather(city: string): Promise<Weather> {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) throw new Error("Could not look up the city");
  const geo = await geoRes.json();
  const place = geo.results?.[0];
  if (!place) throw new Error("City not found");

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
    `&current=temperature_2m,weather_code,wind_speed_10m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather service error");
  const data = await res.json();

  return {
    city: place.name,
    country: place.country ?? "",
    temperature: data.current.temperature_2m,
    windSpeed: data.current.wind_speed_10m,
    description: describe(data.current.weather_code),
  };
}
