var fs = require('fs');

var JSONData = JSON.parse(fs.readFileSync('_data.json', 'utf-8'));
var data = [];


for(var i = 0; i < JSONData.length; i++) {
  var obj = JSONData[i];

  if(i === 0) {
    for(var j = 0; j < obj.items.length; j++) {

      // if(obj)/

      // if(obj.items[j].media_type === "movie") {
        var a = getRandomizer(1000, 3720000);
        obj.items[j].media_position = a;
        obj.items[j].media_duration = getRandomizer(a, a * 2);
        console.log(obj.items[j]);
      // }
    }
  }

  data.push(obj);

  if(JSONData.length-1 === i) {
    fs.writeFile('_data-001.json', JSON.stringify(data, null, 2), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log('JSON saved to data.json');
      }
    });
  }
}



function getRandomizer(bottom, top) {
  return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}