[
    {
        "id": "9333afd3.d2139",
        "type": "tab",
        "label": "Panstamp"
    },
    {
        "id": "e276c182.9a632",
        "type": "debug",
        "z": "9333afd3.d2139",
        "name": "",
        "active": true,
        "console": "false",
        "complete": "true",
        "x": 848,
        "y": 244,
        "wires": []
    },
    {
        "id": "32c5bf6b.e44be",
        "type": "serial in",
        "z": "9333afd3.d2139",
        "name": "",
        "serial": "974e5922.c07a38",
        "x": 110,
        "y": 320,
        "wires": [
            [
                "222d327b.56d70e",
                "f2faa54a.f5e828"
            ]
        ]
    },
    {
        "id": "e34c8a3.9234678",
        "type": "serial out",
        "z": "9333afd3.d2139",
        "name": "",
        "serial": "974e5922.c07a38",
        "x": 780,
        "y": 80,
        "wires": []
    },
    {
        "id": "dcb5e2cf.a5366",
        "type": "function",
        "z": "9333afd3.d2139",
        "name": "Format TIM",
        "func": "// GET TIME\nconst date = new Date();\nvar timeStamp = date.getTime();\n\n//get time HEX in sec\ntimeStamp = Math.round(timeStamp /=1000).toString(16);\n\n//convert Hexa\nmsg.payload = \"[0000000001TIM@\"+timeStamp+\"0000]\";\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 330,
        "y": 60,
        "wires": [
            [
                "9af07783.b2a628"
            ]
        ]
    },
    {
        "id": "1f2f3d8f.621cb2",
        "type": "inject",
        "z": "9333afd3.d2139",
        "name": "",
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "repeat": "7200",
        "crontab": "",
        "once": true,
        "x": 130,
        "y": 60,
        "wires": [
            [
                "dcb5e2cf.a5366"
            ]
        ]
    },
    {
        "id": "c8e74c50.220c88",
        "type": "inject",
        "z": "9333afd3.d2139",
        "name": "Inject Periodicié 5 min",
        "topic": "",
        "payload": "[0000000001PERC012C0000]",
        "payloadType": "str",
        "repeat": "14400",
        "crontab": "",
        "once": true,
        "x": 170,
        "y": 120,
        "wires": [
            [
                "b07f9c81.f75c2"
            ]
        ]
    },
    {
        "id": "e77e9256.eb5bc",
        "type": "function",
        "z": "9333afd3.d2139",
        "name": "Parse and Decode ",
        "func": "//-------------------------------------------------//\n//                                                 //\n//           Declaration des variables             //\n//                                                 //\n//-------------------------------------------------//\n\n//msg.Header for POST data\nmsg.headers = {'content-type':'application/x-www-form-urlencoded'};\n\n// enlever [] et CRC16\nmsg.payload = msg.payload.slice(1,-3);\n//Time from sonde\nmsg.timeStamp = parseInt(msg.payload.slice(0,8),16)*1000;\n//Sonde ID\nid = msg.payload.slice(8,16);\n\n//Trouver nombre de messages\nvar nombreMess = (msg.payload.match(/(.{2})RL1/)[1])-2;\n\n//RL1\nvar rssi = msg.payload.slice(18,22)+\"=\";\nvar rssiVal = parseInt(msg.payload.match(/RL1B(.{2})/)[1],16);\n\n//RL2\nvar lqi = msg.payload.slice(24,28)+\"=\";\nvar lqiVal = parseInt(msg.payload.match(/RL2B(.{2})/)[1],16);\n\n//Ne garder que la partie a decoder\nmsg.adecoder = msg.payload.slice(30,-4);\n\n//formatage début de message Payload\n//msg.payload = \"__device=\"+id+\"&__time=\"+msg.timeStamp+\"&\"+id+rssi+rssiVal+\"&\"+id+lqi+lqiVal;\nmsg.payload = \"__device=Panstamp&__time=\"+msg.timeStamp+\"&\"+id+rssi+rssiVal+\"&\"+id+lqi+lqiVal;\n\n//-------------------------------------------------//\n//                                                 //\n//     Declaration des fonctions de decodage       //\n//                                                 //\n//-------------------------------------------------//\n\n// Fonction unsigned to signed \n\nvar uintToInt = function(uint, nbit) {\n    nbit = +nbit || 32;\n    uint <<= 32 - nbit;\n    uint >>= 32 - nbit;\n    return uint;\n}\n\n// G - Fonction de décodage float16\n\nvar decodeFloat16 = function (binary) {\n            var exponent = (binary & 0x7C00) >> 10;\n            var fraction = binary & 0x03FF;\n            return (binary >> 15 ? -1 : 1) * (\n            exponent ?\n        (\n            exponent === 0x1F ?\n            fraction ? NaN : Infinity :\n            Math.pow(2, exponent - 15) * (1 + fraction / 0x400)\n        ) :\n        6.103515625e-5 * (fraction / 0x400)\n    );\n}\n\n// H Fonction hex to Float 32 bit \n\nvar hexToFloat32 = function (intval) {\n    var fval = 0.0;\n    var x;//exponent\n    var m;//mantissa\n    var s;//sign\n    s = (intval & 0x80000000)?-1:1;\n    x = ((intval >> 23) & 0xFF);\n    m = (intval & 0x7FFFFF);\n    switch(x) {\n        case 0:\n            //zero, do nothing, ignore negative zero and subnormals\n            break;\n        case 0xFF:\n            if (m) fval = NaN;\n            else if (s > 0) fval = Number.POSITIVE_INFINITY;\n            else fval = Number.NEGATIVE_INFINITY;\n            break;\n        default:\n            x -= 127;\n            m += 0x800000;\n            fval = s * (m / 8388608.0) * Math.pow(2, x);\n            break;\n    }\n    return fval;\n}\n\n//-------------------------------------------------//\n//                                                 //\n//                    Decodage                     //\n//                                                 //\n//-------------------------------------------------//\n\nvar decode = function() {\n\n        //declaration des variables\n\n    var registre = msg.adecoder.slice(0,4);\n    var type = msg.adecoder.slice(3,4);\n    var hex ;\n    var bin ;\n    var decimal ;\n    var hexDecoded ;\n    msg.adecoder = msg.adecoder.substring(4); // enleve le registre et sous registre\n    \n//FONCTION si type = A\n    if (type == \"A\"){\n        hex = msg.adecoder.slice(0,2);\n        hexDecoded = parseInt(hex,16);\n        msg.adecoder = msg.adecoder.substring(2); // enleve le message décodé du string\n    }\n\n //FONCTION si type = B Signed 8b\n    else if (type == \"B\"){\n        hex = msg.adecoder.slice(0,2);\n        bin = parseInt(hex,16).toString(2);\n        decimal = parseInt(bin,2).toString();\n        hexDecoded = uintToInt (decimal,8);\n        msg.adecoder = msg.adecoder.substring(2); // enleve le message décodé du string\n    }\n\n //FONCTION si type = C unsigned 16b\n    else if (type == \"C\"){\n        hex = msg.adecoder.slice(0,4);\n        hexDecoded = parseInt(hex,16);\n        msg.adecoder = msg.adecoder.substring(4); // enleve le message décodé du string\n    }\n\n\n //FONCTION si type = D Signed 16b\n    else if (type == \"D\"){\n        hex = msg.adecoder.slice(0,4);\n        bin = parseInt(hex,16).toString(2);\n        decimal = parseInt(bin,2).toString();\n        hexDecoded = uintToInt (decimal,16);\n        msg.adecoder = msg.adecoder.substring(4); // enleve le message décodé du string\n    }\n\n\n //FONCTION si type = E unseigned 32b\n    else if (type == \"E\"){\n        hex = msg.adecoder.slice(0,8);\n        hexDecoded = parseInt(hex,16);\n        msg.adecoder = msg.adecoder.substring(8); // enleve le message décodé du string\n    }\n\n//FONCTION si type = F signed 32b\n    else if (type == \"F\"){\n        hex = msg.adecoder.slice(0,8);\n        bin = parseInt(hex,16).toString(2);\n        decimal = parseInt(bin,2).toString();\n        hexDecoded = uintToInt (decimal,32);\n        msg.adecoder = msg.adecoder.substring(8); // enleve le message décodé du string\n    }\n    \n//FONCTION si type = G\n\n    else if (type == \"G\"){      \n        hex = \"0x\"+msg.adecoder.slice(0,4);\n    //decode float    \n        hexDecoded = decodeFloat16(hex);\n        msg.adecoder = msg.adecoder.substring(4); // enleve le message décodé du string\n    }\n    \n//FONCTION si type = H\n    else if (type == \"H\"){\n        hex = \"0x\"+msg.adecoder.slice(0,8);\n        hexDecoded = hexToFloat32(hex).toFixed(2);// Converti hex to float et garde 2 decimale\n        msg.adecoder = msg.adecoder.substring(8); // enleve le message décodé du string\n    }\n    \n//FONCTION si type = I\n    else if (type == \"I\"){\n        // ???\n    }        \n    \n// ajoute la donnée dans le Payload\nmsg.payload += \"&\"+id+registre+\"=\"+hexDecoded;\n    \n};\n\n//Lancer la fonction le nombre de fois qu'il y a de devices\n\nfor(var i = 0; i < nombreMess; i++){\n     decode()\n}\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 690,
        "y": 340,
        "wires": [
            [
                "8fe5d5b3.8e8568",
                "f2faa54a.f5e828"
            ]
        ]
    },
    {
        "id": "9af07783.b2a628",
        "type": "delay",
        "z": "9333afd3.d2139",
        "name": "",
        "pauseType": "delay",
        "timeout": "5",
        "timeoutUnits": "seconds",
        "rate": "1",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "1",
        "randomLast": "5",
        "randomUnits": "seconds",
        "drop": false,
        "x": 540,
        "y": 60,
        "wires": [
            [
                "e34c8a3.9234678"
            ]
        ]
    },
    {
        "id": "9fc06baf.fb2fe8",
        "type": "comment",
        "z": "9333afd3.d2139",
        "name": "delay pour etre sur que le port soit ouvert",
        "info": "",
        "x": 600,
        "y": 20,
        "wires": []
    },
    {
        "id": "222d327b.56d70e",
        "type": "switch",
        "z": "9333afd3.d2139",
        "name": "Switch réponse vs données",
        "property": "payload",
        "propertyType": "msg",
        "rules": [
            {
                "t": "cont",
                "v": "TIM",
                "vt": "str"
            },
            {
                "t": "cont",
                "v": "PERC",
                "vt": "str"
            },
            {
                "t": "cont",
                "v": "CLR",
                "vt": "str"
            },
            {
                "t": "else"
            }
        ],
        "checkall": "true",
        "outputs": 4,
        "x": 360,
        "y": 320,
        "wires": [
            [
                "e276c182.9a632"
            ],
            [
                "e276c182.9a632"
            ],
            [
                "e276c182.9a632"
            ],
            [
                "e77e9256.eb5bc"
            ]
        ]
    },
    {
        "id": "b07f9c81.f75c2",
        "type": "delay",
        "z": "9333afd3.d2139",
        "name": "",
        "pauseType": "delay",
        "timeout": "6",
        "timeoutUnits": "seconds",
        "rate": "1",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "1",
        "randomLast": "5",
        "randomUnits": "seconds",
        "drop": false,
        "x": 540,
        "y": 120,
        "wires": [
            [
                "e34c8a3.9234678"
            ]
        ]
    },
    {
        "id": "449cc288.b1487c",
        "type": "inject",
        "z": "9333afd3.d2139",
        "name": "Remise a 0 Table d'adresse CLR",
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "repeat": "",
        "crontab": "",
        "once": false,
        "x": 190,
        "y": 180,
        "wires": [
            [
                "bc356e3e.92534"
            ]
        ]
    },
    {
        "id": "bc356e3e.92534",
        "type": "function",
        "z": "9333afd3.d2139",
        "name": "Format CLR",
        "func": "// GET TIME\nconst date = new Date();\nvar timeStamp = date.getTime();\n\n//get time HEX in sec\ntimeStamp = Math.round(timeStamp /=1000).toString(16);\n\n//convert Hexa\nmsg.payload = \"[0000000001CLR@\"+timeStamp+\"0000]\";\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 510,
        "y": 180,
        "wires": [
            [
                "e34c8a3.9234678"
            ]
        ]
    },
    {
        "id": "f2faa54a.f5e828",
        "type": "debug",
        "z": "9333afd3.d2139",
        "name": "",
        "active": true,
        "console": "false",
        "complete": "true",
        "x": 410,
        "y": 569,
        "wires": []
    },
    {
        "id": "8fe5d5b3.8e8568",
        "type": "link out",
        "z": "9333afd3.d2139",
        "name": "Panstamp HTTP post",
        "links": [
            "5e35cffa.aafcd"
        ],
        "x": 1006,
        "y": 337,
        "wires": []
    },
    {
        "id": "341b8da1.0237c2",
        "type": "throttle",
        "z": "9333afd3.d2139",
        "name": "",
        "throttleType": "time",
        "timeLimit": "5",
        "timeLimitType": "minutes",
        "countLimit": 0,
        "blockSize": 0,
        "locked": false,
        "x": 885.5,
        "y": 365,
        "wires": [
            [
                "8fe5d5b3.8e8568"
            ]
        ]
    },
    {
        "id": "974e5922.c07a38",
        "type": "serial-port",
        "z": "",
        "serialport": "/dev/ttyUSB1",
        "serialbaud": "38400",
        "databits": "8",
        "parity": "none",
        "stopbits": "1",
        "newline": "50",
        "bin": "false",
        "out": "time",
        "addchar": false
    }
]