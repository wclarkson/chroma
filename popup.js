var ip = "192.168.1.115";

function setLampColor(i, h, s, b) {
  $.ajax({
    url: "http://" + ip + "/api/newdeveloper/lights/" + i + "/state",
    type: 'PUT',
    data: JSON.stringify({
      "on": true,
    "sat": s,
    "bri": b*2,
    "hue": h+8000
    }),
    complete: function(a,b) { console.log(a,b); }
  });
}

function rgbToHsl(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h*65535), Math.round(s*255), Math.round(l*255)];
}

chrome.extension.onMessage.addListener(function(req, sender) {
  if (req.action == "getBackgroundColor") {
    var c = req.color.match(/\d+/g);
    var hsb = rgbToHsl(c[0], c[1], c[2]);
    $('#doge').text(hsb.join(' '));
    setLampColor(1, hsb[0], hsb[1], hsb[2]);
  }
});

$(document).ready(function() {
  chrome.storage.sync.get("hue-ip", function(vals) {
    ip = vals["hue-ip"];
    $("#hue-ip").val(ip);
  });
  chrome.tabs.executeScript(null, { file: "getBackgroundColor.js" },
    function () {
      if (chrome.extension.lastError) {
        console.log("error!");
      }
    });
  $("#hue-ip").blur(function(obj) {
    ip = obj.currentTarget.value;
    chrome.storage.sync.set({'hue-ip': ip}, null);
  });
});
