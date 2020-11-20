# -*- coding: UTF-8 -*-
from app import app
from app.dataService.dataService import DataService
import json
import os
import numpy as np
from flask import send_file, request, jsonify, send_from_directory

_current_dir = os.path.dirname(os.path.abspath(__file__))

dataService = DataService()

def default(o):
    if isinstance(o, np.int_):
        return int(o)
    raise TypeError

@app.route('/')
def _index():
    return json.dumps(f"hi this is backend for code challenge")

@app.route('/read')
def _read():
    return json.dumps(dataService.read())

@app.route('/config')
def _config():
    return json.dumps(dataService.load_config())
@app.route('/query/<code>', methods=['GET'])
def _query(code):
    print(code)
    data = dataService.query(code)
    return json.dumps(data)


# @app.route('/write', methods=['POST'])
# def _write():
#     post_data = json.loads(request.data.decode())
#     return dataService.write(post_data)

if __name__ == '__main__':
    pass
