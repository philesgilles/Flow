[
    {
        "id": "e4ef0e31.4dc4",
        "type": "tab",
        "label": "1-Wire"
    },
    {
        "id": "ca958bc0.f954f8",
        "type": "inject",
        "z": "e4ef0e31.4dc4",
        "name": "",
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "repeat": "300",
        "crontab": "",
        "once": false,
        "x": 150,
        "y": 140,
        "wires": [
            [
                "76363770.087238"
            ]
        ]
    },
    {
        "id": "76363770.087238",
        "type": "owfs",
        "z": "e4ef0e31.4dc4",
        "name": "",
        "uncached": false,
        "mode": "read",
        "host": "localhost",
        "port": 4304,
        "paths": [
            "28.FFA0882C0400/temperature",
            "28.FFA06D2D0400/temperature",
            "28.FF16FD8A1603/temperature",
            "28.FFBE6D2D0400/temperature",
            "28.FFB36B2D0400/temperature"
        ],
        "x": 340,
        "y": 140,
        "wires": [
            [
                "bfec04b4.05cd98"
            ]
        ]
    },
    {
        "id": "482af6ab.2a3ad8",
        "type": "debug",
        "z": "e4ef0e31.4dc4",
        "name": "",
        "active": true,
        "console": "false",
        "complete": "false",
        "x": 890,
        "y": 100,
        "wires": []
    },
    {
        "id": "bfec04b4.05cd98",
        "type": "function",
        "z": "e4ef0e31.4dc4",
        "name": "Format HTTP POST",
        "func": "// GET TIME\nconst date = new Date();\nconst timeStamp = date.getTime();\n\nid = msg.topic.slice(0,15);\n\nmsg.payload = \"__device=1Wire&__time=\"+timeStamp+\"&\"+id+\"_T=\"+msg.payload;\n\n\n\n\n// Content Type for post form-data\nmsg.headers = {'content-type':'application/x-www-form-urlencoded'};\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 590,
        "y": 140,
        "wires": [
            [
                "482af6ab.2a3ad8",
                "8f438fd1.e0d29"
            ]
        ]
    },
    {
        "id": "8f438fd1.e0d29",
        "type": "link out",
        "z": "e4ef0e31.4dc4",
        "name": "1-Wire HTTP POST",
        "links": [
            "5e35cffa.aafcd"
        ],
        "x": 840,
        "y": 140,
        "wires": []
    }
]