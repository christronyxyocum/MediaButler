const apiauth = require('../apiauth.json');
const request = require('request');

exports.run = (bot, msg, args = []) => {
  const max = 4462;
  var query = args.join(" ");
  if (!args[0])
  {
    msg.channel.send('Dont forget to add an artist!');
  } else {
    var url = 'http://' + apiauth.lidarr_host + apiauth.lidarr_baseurl + '/api/v1/artist/lookup?term=' + query +'&apikey=' + apiauth.lidarr_apikey;
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
          var info = JSON.parse(body)
          if (info[0] == undefined) {
            msg.channel.send('Cant find artist.')
          } else {

          if (info[0].overview == undefined) {
            var overview = "No description";
          } else {
            var overview = info[0].overview;
          }

          if (info[0].images[2] == undefined) {
            var imageUrl = "https://via.placeholder.com/750x150";
          } else {
            var imageUrl = info[0].images[2].url;
          }

          var trimmedOverview = overview.substring(0, 550);

          var albumCount = info[0].albums

          if (info[0].ended == false) {
            var active = "Yes";
          } else {
            var active = "No";
          }

          msg.channel.send({
            "content": "As requested....",
            "embed": {
              "title": info[0].artistName,
              "description": trimmedOverview + "... https://musicbrainz.org/artist/" + info[0].foreignArtistId,
              "color": 11360941,
              "timestamp": new Date(),
              "footer": {
                "icon_url": msg.author.avatarURL,
                "text": "Called by " + msg.author.username
              },
              "image": {
                "url": imageUrl,
              },
              "author": {
                "name": info[0].artistName,
                "url": "https://musicbrainz.org/artist/" + info[0].foreignArtistId,
                "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
              },
              "fields": [
                {
                  "name": "Artist",
                  "value": info[0].artistName,
                  "inline": true
                },
                {
                  "name": "Type",
                  "value": info[0].artistType,
                  "inline": true
                },
                {
                  "name": "Genre",
                  "value": info[0].disambiguation || "No genre defined",
                  "inline": true
                },
                {
                  "name": "Artist Active",
                  "value": active,
                  "inline": true
                },
                {
                  "name": "Musicbrainz ID",
                  "value": info[0].foreignArtistId,
                  "inline": true
                }
              ]
            }
          }
        );
      } // if(!error
      }
    });
  }};

  exports.conf = {
    enabled: true, // not used yet
    guildOnly: false, // not used yet
    aliases: ["a"],
    permLevel: 0 // Permissions Required, higher is more power
  };
  exports.help = {
    name : "artist",
    description: "Pulls info for an artist",
    usage: "artist <artist name>"
  };
