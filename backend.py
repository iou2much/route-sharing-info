#! /usr/bin/env python3

from flask import Flask, request, Response,redirect,url_for
import json
import  pandas as pd
import re
import time
import glob
import requests

app = Flask(__name__)


@app.route("/cn_api/save_info", methods=["POST"])
def save_info():
    data = dict(request.form)
    # data = json.loads(data)
    loc_kw = data['from'].split('::')[1]
    # kw = '白云区同和街道蟾蜍石中街22号'

    city='广州'
    types=''
    try:
    # if True:
        # key='1ec3aa621f5e60a8e55b9c639dd724af'
        key='8d6d855e773caafe9e95d8251ee4152c'
        url = f'https://restapi.amap.com/v3/place/text?key={key}&keywords={loc_kw}&types={types}&city={city}&children=1&offset=20&page=1&extensions=all'
    
        rsp = requests.get(url)
        d = json.loads(rsp.content)
        # print(d)
        loc = d['pois'][0]['location']
        # print(loc)
        data['loc'] = loc
    except:
        print('error get loc')


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

