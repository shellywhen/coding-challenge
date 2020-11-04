# -*- coding: utf-8 -*-
from collections import OrderedDict
import os
import requests
import datetime
import math
import numpy as np
import pandas as pd
import re
import sys
import json

_current_dir = os.path.dirname(os.path.abspath(__file__))
api = "O6K9YK73WIFU2L6B"
url = "https://www.alphavantage.co/query"

# https://www.jianshu.com/p/8c64d039faf4
# Alpha vintage API key: O6K9YK73WIFU2L6B

funcnames = ["TIME_SERIES_DAILY"]
keys = ['1d']

def getParam(code, funcname):
    return   {
    'function': funcname,
    'symbol': code,
    'datatype': 'json',
    'apikey': api
    }

def getQueryUrl(code, funcname):
    return f"{url}?symbol={code}&function={funcname}&apikey={api}"


class DataService(object):
    def __init__(self):
        return

    def wrapRawJson(self, res):
        return

    def queryFromDb(self):
        return

    def query(self, code):
        arr = {}
        for idx, funcname in enumerate(funcnames):
            tmpurl = f"{url}?symbol={code}&function={funcname}&apikey={api}"
            res = requests.get(tmpurl)
            print('hello', tmpurl, res.json())
            print(getParam(code, funcname))
            res = requests.get(url, getParam(code, funcname))
            print(res.status_code)
            if (res.status_code == 200):
                print(res)
                # arr[keys[idx]] = response.json()['response']
        return {
            'meta': {},
            'data': arr
        }

if __name__ == '__main__':
    print('start dataservice')
    dataService = DataService()
