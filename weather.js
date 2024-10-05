var map = L.map('weathermap').setView([38, -95], 4);

// Change basemap to one that works well with weather layers
var Esri_WorldImagery = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var radarURL = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi';
var radarDisplayOptions = {
    layers: 'nexrad-n0r-900913',
    format: 'image/png',
    transparent: true,
    maxZoom: 20
};
var radar = L.tileLayer.wms(radarURL, radarDisplayOptions).addTo(map);

var weatherAlertsUrl = 'https://www.weather.gov/documentation/services-web-api#/default/get_alerts_active';

$.getJSON(weatherAlertsUrl, function(data) {
    L.geoJSON(data, {
        style: function(feature) {
            var alertColor = 'pink'; 
            if (feature.properties.severity === 'Severe') {
                alertColor = 'red';
            } else if (feature.properties.severity === 'Extreme') {
                alertColor = 'purple';
            } else if (feature.properties.severity === 'Minor') {
                alertColor = 'blue';
            }
            return { color: alertColor };
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`
                <b>${feature.properties.headline}</b><br>
                <b>Severity:</b> ${feature.properties.severity}<br>
                <b>Description:</b> ${feature.properties.description}
            `);
        }
    }).addTo(map);
});