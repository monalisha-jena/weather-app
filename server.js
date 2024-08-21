const http = require('http');
const axios = require('axios');

const API_KEY = '6f45278b4ba9767a0a5338eb2dc3deea'; 

const getWeatherData = async (city) => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        return response.data;
    } catch (error) {
        throw new Error('Unable to fetch weather data. Please check the city name.');
    }
};


const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url.startsWith('/weather')) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const city = url.searchParams.get('city');

        if (!city) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'City query parameter is required' }));
            return;
        }

        try {
            const weatherData = await getWeatherData(city);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(weatherData));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});
