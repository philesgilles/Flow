// GET TIME
const date = new Date();
const timeStamp = date.getTime();

//CLEAN
decode = msg.payload["Devices-Detail-Response"];
msg.payload={}; //vider le message payload

// Device Name
msg.payload.device=decode.DeviceName[0];

// Default parameters in message 
msg.payload="__device=" + msg.payload.device;
msg.payload+="&__time=" + timeStamp;

var DS18B20 = decode.owd_DS18B20;
var DS18S20 = decode.owd_DS18S20;
var EDS0071 = decode.owd_EDS0071;
var EDS0065 = decode.owd_EDS0065;

// Populate msg.payload with info if exist

if (typeof EDS0065 !== 'undefined') {
    EDS0065.forEach(function (sensorValue) {
    	msg.payload+=`&${sensorValue.ROMId[0]+"_T"}=${sensorValue.Temperature[0]._}&${sensorValue.ROMId[0]+"_H"}=${sensorValue.Humidity[0]._}`;
	});
}

if (typeof DS18B20 !== 'undefined') {
    DS18B20.forEach(function (sensorValue) {
    	msg.payload+=`&${sensorValue.ROMId[0]+"_T"}=${sensorValue.Temperature[0]._}`;
	});
}
if (typeof DS18S20 !== 'undefined') {
    DS18S20.forEach(function (sensorValue) {
    	msg.payload+=`&${sensorValue.ROMId[0]+"_T"}=${sensorValue.Temperature[0]._}`;
	});
}

if (typeof EDS0071 !== 'undefined') {
    EDS0071.forEach(function (sensorValue) {
    	msg.payload+=`&${sensorValue.ROMId[0]+"_T"}=${sensorValue.Temperature[0]._}`;
	});
}


// Content Type for post form-data
msg.headers = {'content-type':'application/x-www-form-urlencoded'};

return msg;