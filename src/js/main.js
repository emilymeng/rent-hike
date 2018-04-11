//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

var data = require("./rent-slowdown-Q1.geo.json");

var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);

var mapElement = document.querySelector("leaflet-map");

if (mapElement) {
  var L = mapElement.leaflet;
  var map = mapElement.map;

  map.scrollWheelZoom.disable();

  var focused = false;

  var year = "Q12018";

  var commafy = s => (s * 1).toLocaleString().replace(/\.0+$/, "");
  
  data.features.forEach(function(f) {
  ["Yearly", "Quarterly"].forEach(function(prop) {
    f.properties[prop] = (f.properties[prop] * 1).toFixed(1);
  });
});

  var onEachFeature = function(feature, layer) {
    // var breakdown = breakdownData[feature.properties.BEAT]
    layer.bindPopup("", {
      minWidth: 200
    });

console.log(feature.properties.city, commafy(feature.properties.Q12017)); 
    layer.on({
      popupopen: function(e) {
        e.popup.setContent(`
            <h4>${feature.properties.city}</h4>
            2018 monthly rent: $${commafy(feature.properties.Q12018)}<br>
            2017 monthly rent: $${commafy(feature.properties.Q12017)}<br>
            Yearly change: ${feature.properties.Yearly}%<br>
            Quarterly change: ${feature.properties.Quarterly}%<br>`);
        layer.setStyle({ weight: 2, fillOpacity: 1 });
      },
      mouseover: function(e) {
        layer.setStyle({ weight: 2, fillOpacity: 1 });
      },
      mouseout: function(e) {
        if (focused && focused == layer) { return }
        layer.setStyle({ weight: 0.5, fillOpacity: 0.5 });
      }
    });
  };

  map.on("popupclose", function() {
    if (focused) {
      focused.setStyle({ weight: 0.5, fillOpacity: 0.7 });
      focused = false;
    }
  });

  var getColor = function(d) {
    var value = d[year];
    if (typeof value == "string") {
      value = Number(value.replace(/,/, ""));
    }
    console.log(value)
    if (typeof value != "undefined") {
      // condition ? if-true : if-false;
     return value >= 2100 ? '#d64b13' :
             value >= 1900 ? '#f99f4e' :
             value >= 1700 ? '#fff9c0' :
             value >= 1500 ? '#c4e5ae' :
             value >= 1300 ? '#88aa65' :
             value >= 1100 ? '#63775B' :
             'pink' ;
    } else {
      return "gray"
    }
  };

  var style = function(feature) {
    var s = {
      fillColor: getColor(feature.properties),
      weight: 0.5,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.5
    };
    return s;
  }

  var geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

  }

map.setView([47.609, -121.900], 9);

