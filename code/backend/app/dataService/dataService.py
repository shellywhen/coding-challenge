# -*- coding: utf-8 -*-
from cacheService import MongoCache
import requests

api = "O6K9YK73WIFU2L6B"
url = "https://www.alphavantage.co/query"

# https://www.jianshu.com/p/8c64d039faf4
# Alpha vintage API key: O6K9YK73WIFU2L6B

class DataService(object):
    def __init__(self):
        self.cacheService = MongoCache()
        return

    def queryFromApi(self, code):
        """Request data from web API.
        """
        res = requests.get(getQueryUrl(code, 'OVERVIEW')).json()
        overview = getOverview(res)
        daily_5min = requests.get(getQueryUrl(code, 'TIME_SERIES_INTRADAY', '&interval=5min')).json()['Time Series (5min)']
        daily_15min = requests.get(getQueryUrl(code, 'TIME_SERIES_INTRADAY', '&interval=30min')).json()['Time Series (15min)']
        daily_60min = requests.get(getQueryUrl(code, 'TIME_SERIES_INTRADAY', '&interval=30min')).json()['Time Series (60min)']
        daily = requests.get(getQueryUrl(code, 'TIME_SERIES_DAILY')).json()['Daily Time Series']
        weekly = requests.get(getQueryUrl(code,'TIME_SERIES_WEEKLY')).json()['Weekly Time Series']
        monthly = requests.get(getQueryUrl(code, 'TIME_SERIES_MONTHLY')).json()['Monthly Time Series']
        time_series = getDataSeries(daily_5min, daily_15min, daily_60min, daily, weekly, monthly)
        meta = getMeta(daily_5min, daily)
        return {
            'meta': meta,           # basic metadata today
            'data': time_series,  # wrapped data for visualization
            'overview': overview  # the general information about the stock
        }

    def query(self, code):
        """ API for fetching data for visualization.
        If the data have not been cached in local dataset, request data from web service.
        :code: the code that the user give.
        """
        data  = self.queryFromApi(code)
        # try:
        #     data = self.cacheService[code]
        # except:
        #     data  = self.queryFromApi(code)
        #     self.cacheService[code] = data
        return data


def getQueryUrl(code, funcname, addition=''):
    return f"{url}?symbol={code}&function={funcname}{addition}&apikey={api}"

def getMeta(daily_5min, daily):
    meta = {}
    return meta

def getOverview(raw):
    """ Filter out irrelevant infomation of the raw message and use another identifiers.
    """
    return {
        'symbol': raw['Symbol'],
        'name': raw['Name'],
        'description': raw['Description'],
        'exchange': raw['Exchange'],
        'currency': raw['Currency'],
        'sector': raw['Sector'],
        'industry': raw['Industry'],
        'address': raw['Address'],
        'employees': raw['FullTimeEmployees']
    }

def getItem(t, d, time_addon=''):
    return {'time': t + time_addon, 'value': d['4. close']}

def getDataSeries(daily_5min, daily_15min, daily_60min, daily, weekly, monthly):
    res = {
        '1d': [],
        '5d': [],
        '1m': [],
        '6m': [],
        'YTD': [],
        '1y': [],
        '5y': []
    }
    for k, d in enumerate(daily_5min):
        res['1d'].append(getItem(k, d))
    for k, d in enumerate(daily_15min):
        res['1d'].append(getItem(k, d))
    for i, k, d in enumerate(daily_60min):
        res['5d'].append(getItem(k, d))
    for i, (k, d) in enumerate(daily.items()):
        if i < 5:
            res['5d'].append(getItem(k, d, ' 00:00:00'))
        if i < 31:
            res['1m'].append(getItem(k, d))
    for i, (k, d) in enumerate(weekly.items()):
        if i < 26:
            res['6m'].append(getItem(k, d))
        if i < 53:
            res['1y'].append(getItem(k, d))
    for i, (k, d) in enumerate(monthly):
        if i > 60:
            break
        res['5y'].append(getItem(k, d))
    return res  

if __name__ == '__main__':
    print('running dataservice from command')
    dataService = DataService()
    dataService.queryFromApi('IBM')
