#! /usr/bin/env python3

from flask import Flask, request, Response,redirect,url_for
import json
import  pandas as pd
import re
import time
import glob
import requests
# from utils import impala_client
import os

app = Flask(__name__)

print('Loading data...')
area_df = pd.read_csv('school_data/area.csv')

if os.path.exists('school_data/school_data.csv'):
    school_df = pd.read_csv('school_data/school_data.csv')
else:
    school_df = pd.read_csv('school_data/school.csv',error_bad_lines=False)
    print('Loaded school data...')
    school_summ_df = pd.read_csv('school_data/school_summary.csv')
    print('Loaded school summary data...')
    # school_location_df = pd.read_csv('school_data/school_location.csv',error_bad_lines=False)
    school_df = pd.merge(school_df,school_summ_df,how='left',left_on='rn',right_on='sid')


print('Preprocessed data...')

# school_df = pd.merge(school_df,school_location_df,on='rn')#,how='left')
# school_df.province_id = school_df.province_id.astype(int)
# print(school_df.sample(1000))
# print('='*100)

@app.route("/area", methods=["GET"])
def get_area():
    get_data = request.args.to_dict()
    area_type = int(get_data['type'])
    if area_type == 1:
        df = area_df[area_df.type==area_type]
    else:
        df = area_df[(area_df.type==area_type) & (area_df.province_id==get_data['province_id']) ]

    df = df[['id','name']]
    return Response(df.to_json(orient='records'), mimetype='application/json',headers={"Access-Control-Allow-Headers": "x-requested-with,Cache-Control,Pragma,Content-Type,Token, Content-Type","Access-Control-Allow-Credentials":"true","Access-Control-Allow-Methods":"POST, GET, OPTIONS, DELETE","Cache-Control":"no-cache",'Access-Control-Allow-Origin':'*'})

@app.route("/school", methods=["GET"])
def get_school():
    get_data = request.args.to_dict()
    province_id = get_data.get('province_id',0)
    province_id = province_id if province_id != '' else 0

    city_id = get_data.get('city_id',0)
    city_id = city_id if city_id != '' else 0

    school_id = get_data.get('school_id','')

    province_id = float(province_id)
    city_id = float(city_id)
    if school_id:
        df = school_df[school_df.id==school_id]
    elif city_id:
        df = school_df[(school_df.city_id==city_id)]
    elif province_id:
        df = school_df[school_df.province_id==province_id]
    else:
        df = school_df
    print(df.shape)
    def extract_loc(loc):
        return loc.split(',')

    df['lnglat'] = df.location.map(extract_loc)
    df = df[df.user_count > 0]
    df = df[['id','name','user_count','lnglat']]
    return Response(df.to_json(orient='records'), mimetype='application/json',headers={"Access-Control-Allow-Headers": "x-requested-with,Cache-Control,Pragma,Content-Type,Token, Content-Type","Access-Control-Allow-Credentials":"true","Access-Control-Allow-Methods":"POST, GET, OPTIONS, DELETE","Cache-Control":"no-cache",'Access-Control-Allow-Origin':'*'})

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=8070)
    # get_chapter_name()

