[
    {
        "id": "63938216.82652c",
        "type": "tab",
        "label": "Ow-Server"
    },
    {
        "id": "d8e82193.c1626",
        "type": "inject",
        "z": "63938216.82652c",
        "name": "",
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "repeat": "300",
        "crontab": "",
        "once": false,
        "x": 110,
        "y": 100,
        "wires": [
            [
                "e3beb160.31987"
            ]
        ]
    },
    {
        "id": "e3beb160.31987",
        "type": "http request",
        "z": "63938216.82652c",
        "name": "Query OW-Server #1",
        "method": "GET",
        "ret": "txt",
        "url": "http://192.168.0.21/details.xml",
        "tls": "",
        "x": 300,
        "y": 100,
        "wires": [
            [
                "c859e023.80329"
            ]
        ]
    },
    {
        "id": "bc1d5d22.7998b",
        "type": "debug",
        "z": "63938216.82652c",
        "name": "",
        "active": true,
        "console": "false",
        "complete": "payload",
        "x": 1010,
        "y": 140,
        "wires": []
    },
    {
        "id": "c859e023.80329",
        "type": "xml",
        "z": "63938216.82652c",
        "name": "XML to JSON",
        "attr": "",
        "chr": "",
        "x": 540,
        "y": 160,
        "wires": [
            [
                "7f09b696.3d6c98"
            ]
        ]
    },
    {
        "id": "7f09b696.3d6c98",
        "type": "function",
        "z": "63938216.82652c",
        "name": "format HTTP Post for Mango",
        "func": "/*\nvar work;\nwork = msg.payload[\"Devices-Detail-Response\"].owd_DS18B20;\n\n// Content Type for post form-data\n//msg.headers = {'content-type':'application/x-www-form-urlencoded'};\n\nmsg.payload = work[0].Temperature[0]._;\nreturn msg;\n*/\n\ndecode = msg.payload[\"Devices-Detail-Response\"];\nmsg.payload={}; //vider le message payload\n\n// GET TIME\nconst date = new Date();\nconst timeStamp = date.getTime();\n\n// Device Name\nmsg.payload.device=decode.DeviceName[0];\n\n// Default parameters in message \nmsg.payload=\"__device=\" + msg.payload.device;\nmsg.payload+=\"&__time=\" + timeStamp;\n\n// Data payload\nvar sensorsValues = decode.owd_DS18B20;\n\n// Loop function to populate form-data\nsensorsValues.forEach(function (sensorValue) {\n    msg.payload+=`&${sensorValue.ROMId[0]+\"_T\"}=${sensorValue.Temperature[0]._}`;\n});\n\n// Content Type for post form-data\nmsg.headers = {'content-type':'application/x-www-form-urlencoded'};\n\nreturn msg;\n",
        "outputs": 1,
        "noerr": 0,
        "x": 780,
        "y": 160,
        "wires": [
            [
                "bc1d5d22.7998b",
                "b799a2c9.98838"
            ]
        ]
    },
    {
        "id": "b799a2c9.98838",
        "type": "link out",
        "z": "63938216.82652c",
        "name": "Link1",
        "links": [
            "3348fd52.127952",
            "5e35cffa.aafcd"
        ],
        "x": 955,
        "y": 180,
        "wires": []
    },
    {
        "id": "d1b90e72.2c17",
        "type": "comment",
        "z": "63938216.82652c",
        "name": "request XML on Owserver and format for HTTP Post",
        "info": "",
        "x": 210,
        "y": 40,
        "wires": []
    },
    {
        "id": "51cfaf31.968b5",
        "type": "tcp in",
        "z": "63938216.82652c",
        "name": "",
        "server": "server",
        "host": "",
        "port": "49152",
        "datamode": "stream",
        "datatype": "buffer",
        "newline": "",
        "topic": "",
        "base64": false,
        "x": 340,
        "y": 240,
        "wires": [
            [
                "c859e023.80329"
            ]
        ]
    },
    {
        "id": "9cc7c624.64e388",
        "type": "comment",
        "z": "63938216.82652c",
        "name": "Owserver send to Node-red (USE 49152 - 65535) ",
        "info": "",
        "x": 200,
        "y": 180,
        "wires": []
    }
]