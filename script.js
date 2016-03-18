var LineByLineReader = require('line-by-line');
var CSV = require('csv-string');
var Mustache = require('mustache');
var request = require('request');
var fs = require('fs');

var firstLine = true;

//pass in source csv and Mapzen search API Key:  node script.js myfile.csv search-XXXXXXX
var options = {
  sourceFile: process.argv[2],
  api_key: process.argv[3]
}


var output = fs.createWriteStream('output.csv');
output.write('Address,City,State,Zip,Lat,Lon\n'); //write the header row of the output csv

lr = new LineByLineReader(options.sourceFile);

lr.on('line', function (line) {
  
  if (firstLine) {
    firstLine = false;
  } else {
    lr.pause();
    geoCode(line);
  }
});

lr.on('error', function (err) {
    // 'err' contains error object
    console.log(err);
});

lr.on('end', function () {
    console.log('Done!')


});

function geoCode(line) {

  console.log("Geocoding " + line + '...');

  var urlTemplate = 'https://search.mapzen.com/v1/search?api_key={{api_key}}&text={{searchText}}&layers=address&boundary.rect.min_lat=37.670777&boundary.rect.min_lon=-122.579956&boundary.rect.max_lat=37.824972&boundary.rect.max_lon=-122.313538&size=1';

  var url = Mustache.render(urlTemplate, {
    searchText: line,
    api_key: options.api_key
  });

  request(url, function(err, res, body) {
    if(err) {
      console.log(err);
      lr.resume();
    } else {
      var data = JSON.parse(body);

      if(data.features[0].geometry.coordinates) {
        var coords = data.features[0].geometry.coordinates;


      } else {
        var coords = ['null','null'];
        console.log('error, no geometries found')
      }
      
      var outputLine = Mustache.render('{{line}},{{lat}},{{lon}}\n',{
        line: line,
        lat: coords[1],
        lon: coords[0]
      });

      output.write(outputLine);

      setTimeout(function() {
        lr.resume();
      }, 200)   
    }
  })
}
