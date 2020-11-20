from pymongo import MongoClient
from datetime import timedelta, datetime
_db_port = 27017
# Reference: https://www.jianshu.com/p/8c64d039faf4
class MongoCache:
    def __init__(self, expires=timedelta(hours=1)):
        self.client = MongoClient('localhost', _db_port)
        self.db = self.client.cache
        self.db.sheet.create_index('timestamp', expireAfterSeconds=expires.total_seconds())

    def __getitem__(self, code):
        record = self.db.sheet.find_one({'_id': code})
        if record:
            return record['result']
        else:
            print(f"Error: {code} does not exist")
            raise KeyError(code + 'does not exist')

    def __setitem__(self, code, result):
        record = {'result': result, 'timestamp': datetime.utcnow()}
        self.db.sheet.update({'_id': code}, {'$set': record}, upsert=True)
        print(f"Stored {code} into DB.")