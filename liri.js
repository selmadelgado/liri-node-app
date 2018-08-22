require("dotenv").config();
var request = require("request");
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var fs = require("fs");
var movie;
var artist;
var song;
var input = process.argv[3];
for (var i=4; i < process.argv.length; i++) {
  input += (" " + process.argv[i]);
};

// switch statements 
var command= process.argv[2]
switch(command) {
  case "movie-this":
      getMovie();
      break;
  case "concert-this": 
      getBands();
      break;
  case "spotify-this-song": 
      if (!input) {
        getDefaultSong();
      } else {
        getSong();
      }
      break;
  case "do-what-it-says":
      getRead();
      break;
}

//------OMDB --------
function getMovie () {
  if(!input){
    movie= "mr+nobody";
    console.log("No movie selected, default movie loaded");
  } else {
    movie= input.trim();
  }
  
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.omdb;
  request (queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      console.log("==============================================");
      console.log("Title" + ": " + JSON.parse(body).Title + "\n");
      console.log("Release year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Production Location: " + JSON.parse(body).Country);
      console.log("Languages: " + JSON.parse(body).Language);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("Plot: " + JSON.parse(body).Plot + "\n");
      console.log("==============================================");

    } else {
        console.log(error);
    }
  });
};

//-----Bands in Town------
function getBands () {
  artist= input.trim();

  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsintown;
     
  request (queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("==============================================");
      console.log("Artist" + ": " + artist + "\n");
      console.log("Venue" + ": " + JSON.parse(body)[0].venue.name);
      console.log("Location" + ": " + JSON.parse(body)[0].venue.city + "," + JSON.parse(body)[0].venue.country);
      console.log("Time"+ ": " + moment(body[0].datetime, 'YYYY-MM-DDh-m-s').format('MM/DD/YYYY')  + "\n");
      console.log("==============================================");
    } else {
      console.log(error);
    }
  });
};

//-----Spotify---- 
function getSong() {
  song= input.trim();

  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });

  spotify.search({ type: 'track', query: song }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } else {
        console.log("==============================================");
        console.log("Artist" + ": " + data.tracks.items[0].artists[0].name);
        console.log("Album" + ": " + data.tracks.items[0].album.name);
        console.log("Song" + ": " + data.tracks.items[0].name);
        console.log("Preview" + ": " + data.tracks.items[0].external_urls.spotify + "\n");
        console.log("==============================================");
    }
  });
}

function getDefaultSong() {
  song= "the sign";

  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });

  spotify.search({ type: 'track', query: song }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } else {
        console.log("==============================================");
        console.log("Artist" + ": " + data.tracks.items[5].artists[0].name);
        console.log("Album" + ": " + data.tracks.items[5].album.name);
        console.log("Song" + ": " + data.tracks.items[5].name);
        console.log("Preview" + ": " + data.tracks.items[5].external_urls.spotify + "\n");
        console.log("==============================================");
    }
  });
}

//-----Do-What-It-Says----
function doWhatItSays() {

  fs.readFile("random.txt", "utf8", function(error, data) {
    if(error) {
      console.log(error);
    }
    var readArr= data.split(",");
    console.log(readArr);
    
    command = readArr[0];
    input = readArr[1];
    
    switch(command) {
         case "concert-this": 
          getBands();
          break;
          case "movie-this": 
          getMovie();
          break;
         case "spotify-this-song":
          if (!input) {
            getDefaultSong();
          } else {
            getSong();
          }
          break;
        }
  });
}