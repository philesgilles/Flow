[
    {
        "id": "dfab6cca.74f9c",
        "type": "tab",
        "label": "Modbus (RTU Buffered)"
    },
    {
        "id": "2f0694da.fdc7fc",
        "type": "function",
        "z": "dfab6cca.74f9c",
        "name": "buff to string",
        "func": "msg.topic = msg.input.topic;\nmsg.payload = [msg.responseBuffer.buffer.toString('utf8',0,8),\n              msg.responseBuffer.buffer.toString('utf8',9)];\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 750,
        "y": 280,
        "wires": [
            [
                "9501b71e.5a3598",
                "34e2e20b.b2f15e"
            ]
        ]
    },
    {
        "id": "2ea584ae.afc47c",
        "type": "comment",
        "z": "dfab6cca.74f9c",
        "name": "Lire le Buffer 2x16 (U32 BE)",
        "info": "",
        "x": 160,
        "y": 60,
        "wires": []
    },
    {
        "id": "554db64f.5e6e98",
        "type": "comment",
        "z": "dfab6cca.74f9c",
        "name": "HTTP POST",
        "info": "",
        "x": 110,
        "y": 420,
        "wires": []
    },
    {
        "id": "92decbe2.624bb8",
        "type": "inject",
        "z": "dfab6cca.74f9c",
        "name": "Compteur_1",
        "topic": "Socomec Countis - 1",
        "payload": "",
        "payloadType": "date",
        "repeat": "300",
        "crontab": "",
        "once": true,
        "x": 120,
        "y": 160,
        "wires": [
            [
                "71fd4bd7.0890f4",
                "11c4e054.5cde6",
                "b6290bc4.28a46",
                "3b3d3f6c.cc3b2",
                "d568630d.56702"
            ]
        ]
    },
    {
        "id": "71fd4bd7.0890f4",
        "type": "function",
        "z": "dfab6cca.74f9c",
        "name": "Voltage",
        "func": "msg.payload = {'fc': 3, 'unitid': 69, 'address': 50520 , 'quantity': 2 };\nmsg.topic = \"voltage\";\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 360,
        "y": 120,
        "wires": [
            [
                "8a9ba585.cd2b68"
            ]
        ]
    },
    {
        "id": "9501b71e.5a3598",
        "type": "debug",
        "z": "dfab6cca.74f9c",
        "name": "",
        "active": true,
        "console": "false",
        "complete": "true",
        "x": 990,
        "y": 140,
        "wires": []
    },
    {
        "id": "c831a01.df0ee6",
        "type": "function",
        "z": "dfab6cca.74f9c",
        "name": "Format Buffer U32",
        "func": "// setup topic to know wich counter it is (defined by the Inject node)\nmsg.topic = msg.input.topic;\n\n// setup adress to know wich register it is (defined by the getter function)\nmsg.address = msg.input.payload.address;\n\n// read and push the buffer in msg.payload\nmsg.payload = msg.responseBuffer.buffer.readUInt32BE(0);\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 750,
        "y": 160,
        "wires": [
            [
                "34e2e20b.b2f15e",
                "9501b71e.5a3598"
            ]
        ]
    },
    {
        "id": "34e2e20b.b2f15e",
        "type": "link out",
        "z": "dfab6cca.74f9c",
        "name": "Out Modbus buffer U32BE",
        "links": [
            "35f7dec5.58f1f2",
            "feece629.741678"
        ],
        "x": 975,
        "y": 200,
        "wires": []
    },
    {
        "id": "1c3314b3.8b7b8b",
        "type": "modbus-queue-info",
        "z": "dfab6cca.74f9c",
        "name": "",
        "unitid": "69",
        "lowLowLevel": 25,
        "lowLevel": 75,
        "highLevel": 150,
        "highHighLevel": 300,
        "server": "54b98643.3d2b38",
        "errorOnHighLevel": false,
        "x": 786,
        "y": 44,
        "wires": [
            []
        ]
    },
    {
        "id": "b6290bc4.28a46",
        "type": "function",
        "z": "dfab6cca.74f9c",
        "name": "Kw/h",
        "func": "msg.payload = {'fc': 3, 'unitid': 69, 'address': 50770 , 'quantity': 2 };\nmsg.topic = \"Kwh\";\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 350,
        "y": 200,
        "wires": [
            [
                "8a9ba585.cd2b68"
            ]
        ]
    },
    {
        "id": "11c4e054.5cde6",
        "type": "function",
        "z": "dfab6cca.74f9c",
        "name": "Amps",
        "func": "msg.payload = {'fc': 3, 'unitid': 69, 'address': 50528 , 'quantity': 2 };\nmsg.topic = \"amp\";\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 350,
        "y": 160,
        "wires": [
            [
                "8a9ba585.cd2b68"
            ]
        ]
    },
    {
        "id": "8a9ba585.cd2b68",
        "type": "modbus-flex-getter",
        "z": "dfab6cca.74f9c",
        "name": "getter",
        "showStatusActivities": true,
        "showErrors": false,
        "server": "54b98643.3d2b38",
        "x": 550,
        "y": 160,
        "wires": [
            [
                "c831a01.df0ee6"
            ],
            []
        ]
    },
    {
        "id": "b8c94d91.ae5b28",
        "type": "modbus-flex-getter",
        "z": "dfab6cca.74f9c",
        "name": "getter",
        "showStatusActivities": true,
        "showErrors": false,
        "server": "54b98643.3d2b38",
        "x": 556,
        "y": 287,
        "wires": [
            [
                "2f0694da.fdc7fc"
            ],
            []
        ]
    },
    {
        "id": "3b3d3f6c.cc3b2",
        "type": "function",
        "z": "dfab6cca.74f9c",
        "name": "Nom compteur",
        "func": "msg.payload = {'fc': 3, 'unitid': 69, 'address': 50042 , 'quantity': 16 };\nmsg.topic = \"modele\";\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 383,
        "y": 289,
        "wires": [
            [
                "b8c94d91.ae5b28"
            ]
        ]
    },
    {
        "id": "d568630d.56702",
        "type": "function",
        "z": "dfab6cca.74f9c",
        "name": "Kw/h",
        "func": "msg.payload = {'fc': 3, 'unitid': 69, 'address': 50011 , 'quantity': 2 };\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 350,
        "y": 242,
        "wires": [
            []
        ]
    },
    {
        "id": "feece629.741678",
        "type": "link in",
        "z": "dfab6cca.74f9c",
        "name": "",
        "links": [
            "34e2e20b.b2f15e"
        ],
        "x": 95,
        "y": 500,
        "wires": [
            [
                "5b4d1773.9d1be8"
            ]
        ]
    },
    {
        "id": "5b4d1773.9d1be8",
        "type": "function",
        "z": "dfab6cca.74f9c",
        "name": "format HTTP Post for Mango",
        "func": "// GET TIME\nconst date = new Date();\nconst timeStamp = date.getTime();\n\nif (msg.address == 50520) {\n    msg.payload=msg.payload/100;\n}\n\nmsg.payload = \"__device=Modbus&__time=\"+timeStamp+\"&\"+msg.topic+\"=\"+msg.payload;\n\n\n\n\n// Content Type for post form-data\nmsg.headers = {'content-type':'application/x-www-form-urlencoded'};\n\nreturn msg;\n",
        "outputs": 1,
        "noerr": 0,
        "x": 340,
        "y": 500,
        "wires": [
            [
                "57c164b7.cb847c",
                "340b7700.789f5a"
            ]
        ]
    },
    {
        "id": "57c164b7.cb847c",
        "type": "debug",
        "z": "dfab6cca.74f9c",
        "name": "",
        "active": true,
        "console": "false",
        "complete": "false",
        "x": 580,
        "y": 440,
        "wires": []
    },
    {
        "id": "340b7700.789f5a",
        "type": "link out",
        "z": "dfab6cca.74f9c",
        "name": "Modbus Http POST",
        "links": [
            "5e35cffa.aafcd"
        ],
        "x": 575,
        "y": 500,
        "wires": []
    },
    {
        "id": "54b98643.3d2b38",
        "type": "modbus-client",
        "z": "",
        "name": "",
        "clienttype": "serial",
        "bufferCommands": true,
        "stateLogEnabled": false,
        "tcpHost": "127.0.0.1",
        "tcpPort": "502",
        "tcpType": "DEFAULT",
        "serialPort": "/dev/ttyUSB0",
        "serialType": "RTU-BUFFERD",
        "serialBaudrate": "9600",
        "serialDatabits": "8",
        "serialStopbits": "2",
        "serialParity": "none",
        "serialConnectionDelay": "100",
        "unit_id": "",
        "commandDelay": "5",
        "clientTimeout": "1000",
        "reconnectTimeout": "2000"
    }
]