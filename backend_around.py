#! /usr/bin/env python3

from flask import Flask, request, Response,redirect,url_for
import json
import  pandas as pd
import re
import time
import glob
import requests
from datetime import date
from datetime import datetime

app = Flask(__name__)

import  requests
import  json

def sent_massage(title,msg,users,url='http://ccloud.gz.cvte.cn/api/v1/trigger/notice',headers={"Content-Type":"application/json"}):
    url = 'http://ccloud.cvte.com/api/v1/trigger/notice'
    body ={
            "title": title,
            "message": msg,
            "users": users
            }
    print(body)
    requests.post(url,headers =headers,data = json.dumps(body))

def notice_matcher(match_data,data):
    role_name = {'demander':'乘客','provider':'车主','things':'物件'}
    dsts = {
            'c1':'CVTE第一产业园',
            'c2':'CVTE第二产业园',
            'c3':'CVTE第三产业园',
            'c4':'CVTE第四产业园',
        }
    for d in match_data:
        action = '需要从' 
        if data['role'] == 'provider':
            action = '将从'
        elif data['role'] == 'things':
            action = '需要送物件,从'

        title = '拼车小工具'
        msg = '拼车小工具:\n'
        bypass = ''
        if 'bypass' in data:
            bypass = f",并在{data['bypass_start_time']}途经{dsts[data['bypass']]}"
        msg += f"{data['account']}在{data['start_time']}{action}{dsts[data['from']]}到{dsts[data['to']]}{bypass}.\n"
        msg += f"备注信息:{data['extra_info']}\n"
        # msg += f""
        users = [d['account']]
        print(title,msg,users)
        sent_massage(title,msg,users)

def parse_time(time_str):
    times = time_str.lower().split(' ')
    hour, minute = times[0].split(':')
    hour, minute = int(hour), int(minute)
    if times[-1] == 'pm':
        hour += 12 
    return hour * 100 + minute

@app.route("/cn_api/save_info", methods=["POST"])
def save_info():
    data = dict(request.form)
    bypass = ''
    if 'bypass' in data:
        bypass = f"_{data['bypass']}"
    with open(f'around-data/{data["date"]}_{data["role"]}_{data["from"]}{bypass}_{data["to"]}_{data["account"]}.json','w') as f:
        f.write(json.dumps(data))
    
    res = {'code':200}
    match_role = ''
    if data["role"] == 'provider':
        match_role = ['things','demander']
    else:
        match_role = ['provider']

    if data["role"] == 'provider' and bypass != '':
        _matchers = []
        s = parse_time(data['start_time'])
        e = parse_time(data['end_time'])
        matchers = tell_match(match_role,data["date"],range(s,e),data["from"],data["bypass"])
        _matchers.extend(matchers)
        matchers = tell_match(match_role,data["date"],range(s,e),data["from"],data["to"])
        _matchers.extend(matchers)
        s = parse_time(data['bypass_start_time'])
        e = parse_time(data['bypass_end_time'])
        matchers = tell_match(match_role,data["date"],range(s,e),data["bypass"],data["to"])
        _matchers.extend(matchers)
        matchers = _matchers
    else:
        s = parse_time(data['start_time'])
        e = parse_time(data['end_time'])
        matchers = tell_match(match_role,data["date"],range(s,e),data["from"],data["to"])
    print(matchers)
    notice_matcher(matchers,data)

    return Response(json.dumps(res), mimetype='application/json',headers={"Access-Control-Allow-Headers": "x-requested-with,Cache-Control,Pragma,Content-Type,Token, Content-Type","Access-Control-Allow-Credentials":"true","Access-Control-Allow-Methods":"POST, GET, OPTIONS, DELETE","Cache-Control":"no-cache",'Access-Control-Allow-Origin':'*'})

def tell_match(roles, date, time_range, from_, to):
    res = []
    time_range = set(time_range)
    for role in roles:
        # print(f'around-data/{date}_{role}_{from_}_{to}_*.json')
        # print(time_range)
        for f in glob.glob(f'around-data/{date}_{role}_*{from_}_*{to}_*.json'):
            c = open(f,'r').read()
            data = json.loads(c)
            s = parse_time(data['start_time'])
            e = parse_time(data['end_time'])
            _time_range = range(s,e)
            inter = time_range.intersection(_time_range)
            if inter:
                res.append(data)
    return res

@app.route("/cn_api/get_info", methods=["GET"])
def get_info():
    data = request.args.to_dict()
    today = date.today()
    today = today.strftime('%Y-%m-%d')
    now = datetime.now()
    now = int(now.strftime('%H%M'))
    role = data["role"]
    if role == 'not_provider':
        role = '*'

    # print(f'around-data/{today}_{data["role"]}_{data["from"]}_{data["to"]}_*.json')
    res = []
    for f in glob.glob(f'around-data/*_{role}_*{data["from"]}_*{data["to"]}_*.json'):
        if data["role"] == 'not_provider' and 'provider' in f:
            continue
        # print(f)
        info_date = f.split('_')[0].split('/')[-1]
        # print(info_date)
        if info_date < today:
            continue
        c = open(f,'r').read()
        # print(c)
        res_data = json.loads(c)
        e = parse_time(res_data['end_time'])
        bypass_e = 0
        try:
            bypass_e = parse_time(res_data['bypass_end_time'])
        except:
            pass
        
        if now < e or now < bypass_e :
            res.append(res_data)
    
    return Response(json.dumps(res), mimetype='application/json',headers={"Access-Control-Allow-Headers": "x-requested-with,Cache-Control,Pragma,Content-Type,Token, Content-Type","Access-Control-Allow-Credentials":"true","Access-Control-Allow-Methods":"POST, GET, OPTIONS, DELETE","Cache-Control":"no-cache",'Access-Control-Allow-Origin':'*'})

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=8170)
    # get_chapter_name()

