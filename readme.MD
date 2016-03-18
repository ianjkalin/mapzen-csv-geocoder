#mapzen-geocode

A simple node.js script that reads in a CSV of address data, geocodes each line using Mapzen Search, then outputs a csv with `lat` and `lon` columns added.

##How to Use

- Clone this repo
- Install Dependencies
`npm install`
- Run `script.js`, passing it the path to your source CSV, and your Mapzen Search API Key as arguments
`node script.js mydata.csv search-XXXXXXX`

###Data format

This script was developed to use a source CSV with the following format:
```
Address,City,State,Zip
105 Hampshire St,San Francisco,CA,94110
```

###Mapzen Search API
This script uses the following template to make the API call to Mapzen Search:
```
https://search.mapzen.com/v1/search?api_key={{api_key}}&text={{searchText}}&layers=address&boundary.rect.min_lat=37.670777&boundary.rect.min_lon=-122.579956&boundary.rect.max_lat=37.824972&boundary.rect.max_lon=-122.313538&size=1
```

This includes the `boundary.rect` parameters to define a bounding box around the city of San Francisco and the `size` parameter to limit the response to a 1 address.  You can define your own template using the [available options in the Mapzen Search API](https://mapzen.com/documentation/search/search/).