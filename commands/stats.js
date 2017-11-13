const apiauth = require('../apiauth.json');
const request = require('request');

exports.run = (bot, msg, args, perms = []) => {
  const max = 4462;
  if (!args[0]) {
    msg.channel.send('No user selected.');
  } else {
    msg.channel.startTyping();

    const getUsersUrl = 'http://' + apiauth.plexpy_host + apiauth.plexpy_baseurl + '/api/v2?apikey=' + apiauth.plexpy_apikey + '&cmd=get_users';
    request(getUsersUrl, function (e, r, b) {
      const j = JSON.parse(b);
      const user = j.response.data.find(o => o.username === args[0]);
      if (user === undefined) {
        msg.channel.send("Unable to match user");
      }
      else {
        const userid = user.user_id;
        const url = 'http://' + apiauth.plexpy_host + apiauth.plexpy_baseurl + '/api/v2?apikey=' + apiauth.plexpy_apikey + '&cmd=get_user_watch_time_stats&user_id=' + userid;
        const embed_fields = [];
        request(url, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            let info = JSON.parse(body);
            info.response.data.forEach(i => {
              embed_fields.push({
                "name": "Last " + i.query_days + " Days",
                "value": durationFormat(i.total_time) + " / " + i.total_plays + " items",
                "inline": true
              })
            });
            msg.channel.send({
              "embed": {
                "color": 7221572,
                "timestamp": new Date(),
                "footer": {
                  "icon_url": msg.author.avatarURL,
                  "text": "Called by " + msg.author.username
                },
                "author": {
                  "name": "Statistics for " + args[0],
                },
                "fields": embed_fields
              }
            });
          } else {
            msg.channel.send('error: ' + error);
          } // if(!error
          msg.channel.stopTyping();
        });
      }
    });
  }
};

exports.conf = {
  enabled: true, // not used yet
  guildOnly: false, // not used yet
  aliases: [],
  permLevel: 0 // Permissions Required, higher is more power
};
exports.help = {
  name: "stats",
  description: "Gets watched stats about <user>",
  usage: "stats <user>"
};

function durationFormat(time) {
// Hours, minutes and seconds
  const hrs = ~~(time / 3600);
  const mins = ~~((time % 3600) / 60);
  const secs = time % 60;

  let ret = "";
  if (hrs > 0) {
    ret += "" + hrs + "h ";
  }
  if (mins > 0) {
    ret += "" + mins + "m ";
  }
  if (secs > 0) {
    ret += "" + secs + "s ";
  }
  return ret;
}
