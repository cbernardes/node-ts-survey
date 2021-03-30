# node-ts-survey
Node-TS app formatting files

# Node TypeScript Survey
Node TypeScript app runnning survey

## Intall the API
```sh
$ npm install
```

## Run the API
```sh
npm start -- './example-data/survey-1.csv' './example-data/survey-1-responses.csv'
```

## Test the API
```sh
$ npm test
```


## Architectural decisions and overal considerations
- The challege seems to be simple so I tried not to overengineer it.
- I changed some of the examples to increase test coverage.
- I was always focused in performance


## Some feedback 
- The directions could use some improvement
  - from "Any response with a 'submitted_at' date has submitted and is said to have participated in the survey."
  - to "Any response with a 'submitted_at' date is connsidered to have participated in the survey." (At least it is what I understood);