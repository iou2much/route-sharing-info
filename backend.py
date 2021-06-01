#! /usr/bin/env python3

from flask import Flask, request, Response,redirect,url_for
import json
import  pandas as pd
import re
import time
import glob

app = Flask(__name__)


@app.route("/cn_api/save_info", methods=["POST"])
def save_info():
    data = request.form
    # data = json.loads(data)

    with open(f'data/{data["role"]}-{data["to"]}-{data["name"]}.json','w') as f:
        f.write(json.dumps(data))
    
    res = {'code':200}
    # print(res)
    return Response(json.dumps(res), mimetype='application/json',headers={"Access-Control-Allow-Headers": "x-requested-with,Cache-Control,Pragma,Content-Type,Token, Content-Type","Access-Control-Allow-Credentials":"true","Access-Control-Allow-Methods":"POST, GET, OPTIONS, DELETE","Cache-Control":"no-cache",'Access-Control-Allow-Origin':'*'})

@app.route("/cn_api/get_info", methods=["GET"])
def get_info():
    get_data = request.args.to_dict()

    res = []
    for f in glob.glob(f'data/demander-{get_data["to"]}-*.json'):
        c = open(f,'r').read()
        res.append(json.loads(c))
    
    # res = {'code':200}
    # print(res)
    return Response(json.dumps(res), mimetype='application/json',headers={"Access-Control-Allow-Headers": "x-requested-with,Cache-Control,Pragma,Content-Type,Token, Content-Type","Access-Control-Allow-Credentials":"true","Access-Control-Allow-Methods":"POST, GET, OPTIONS, DELETE","Cache-Control":"no-cache",'Access-Control-Allow-Origin':'*'})
if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=6070)
    # get_chapter_name()

