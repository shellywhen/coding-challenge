# Readme

Direct Visit: [shellywhen.github.io/coding-challenge](https://shellywhen.github.io/coding-challenge/)

\*Note that challenge 6 requires a data server.

## Local Setup

### Dependencies

- MongoDb
- Python 3+
- npm

### Backend

```sh
cd code/backend
pip3 install -r requirements.txt
python3 run.py
```

The backend server will be run at `localhost:12050`.

It will use MongoDb at `localhost:27017`.

### Frontend

```sh
cd code/frontend
npm install
npm run serve
```

The frontend server will be run at `localhost:8080`, if no conflicts.

## About

The repository is my entry to the [HKUST Coding Challenge](https://github.com/HKUST-VISLab/coding-challenge).
- C1: basic
- C2: basic
- C3: basic
  - zoom & pan in the node-link diagram
  - smooth transition when reordering the matrix
- C6: basic
  - reject illegal input stock code and recommend best matches 
  - wait for 60s when reaching the API limit
  - provide details about the company
  - change scheme according to stock status (red: fall, green: rise)

\* basic refers to the implementation requirements, and responsive designs to fit in devices, including the chart layout and tooltip position.