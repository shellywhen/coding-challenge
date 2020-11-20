# -* coding: utf-8 -*-
from .cacheService import MongoCache
import requests
from datetime import datetime
import time

api = "O6K9YK73WIFU2L6B"
url = "https://www.alphavantage.co/query"

# Alpha vintage API key: O6K9YK73WIFU2L6B

class DataService(object):
    def __init__(self):
        self.cacheService = MongoCache()
        return

    def makeRequest(self, code, func, identifier=None, addon=''):
        # it is only allowed to make 5 request per minute and 500 in a day.
        requestUrl = f"{url}?symbol={code}&function={func}{addon}&apikey={api}"
        start = datetime.now()
        data = requests.get(requestUrl).json()
        if 'Note' in data:
            time.sleep(60)
            data = requests.get(requestUrl).json()
        end = datetime.now()
        print(requestUrl, ' ',  (end - start).total_seconds(), 's')
        if identifier is None:
            return data
        return data[identifier]

    def queryFromApi(self, code):
        """Request data from web API.
        """
        raw = self.makeRequest(code, 'OVERVIEW')
        overview = getOverview(raw)
        daily_5min = self.makeRequest(code, 'TIME_SERIES_INTRADAY', 'Time Series (5min)', '&interval=5min')
        daily_60min = self.makeRequest(code, 'TIME_SERIES_INTRADAY', 'Time Series (60min)', '&interval=60min')
        daily = self.makeRequest(code, 'TIME_SERIES_DAILY', 'Time Series (Daily)')
        weekly = self.makeRequest(code, 'TIME_SERIES_WEEKLY', 'Weekly Time Series')
        time_series = getDataSeries(daily_5min, daily_60min, daily, weekly)
        meta = getMeta(time_series['1d'], time_series['5d'])
        return {
            'meta': meta,           # basic metadata today
            'data': time_series,    # wrapped data for visualization
            'overview': overview    # the general information about the stock
        }

    def query(self, code):
        """ API for fetching data for visualization.
        If the data have not been cached in local dataset, request data from web service.
        :code: the code that the user give.
        """
        try:
            data = self.cacheService[code]
            print('Loaded data from DB.')
        except:
            data  = self.queryFromApi(code)
            self.cacheService[code] = data
            print('Stored Data into DB.')
        return data


def getMeta(code, daily_5min):
    latestRecordDate = daily_5min[0]['time'][0:10]
    allday = []
    for d in daily_5min:
        if d['time'][0:10] == latestRecordDate:
            allday.append(d['value'])
    meta = {
        'timestr': daily_5min[0]['time'],
        'low': min(allday),
        'open': allday[-1],
        'code': code,
        'current': allday[0],
        'high': max(allday)
    }
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

def getDataSeries(daily_5min, daily_60min, daily, weekly):
    res = {
        '1d': [],
        '5d': [],
        '1m': [],
        '6m': [],
        '1y': [],
    }
    raw_5d = []
    for i, (k, d) in enumerate(daily_5min.items()):
        res['1d'].append(getItem(k, d))
    for i, (k, d) in enumerate(daily_60min.items()):
        raw_5d.append(getItem(k, d))
    for i, (k, d) in enumerate(daily.items()):
        if i < 5:
            raw_5d.append(getItem(k, d, ' 00:00:00'))
        if i < 31:
            res['1m'].append(getItem(k, d, ' 00:00:00'))
    for i, (k, d) in enumerate(weekly.items()):
        if i < 26:
            res['6m'].append(getItem(k, d, ' 00:00:00'))
        if i < 53:
            res['1y'].append(getItem(k, d, ' 00:00:00'))
    res['5d'] = sorted(raw_5d, key=lambda k: k['time']) 
    return res  

if __name__ == '__main__':
    print('running dataservice from command')
    dataService = DataService()
    dataService.queryFromApi('IBM')
