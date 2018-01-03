# Data Manipulation Lib written in Typescript
[![Build Status](https://travis-ci.org/piyushgupta1/data-worker.svg?branch=master)](https://travis-ci.org/piyushgupta1/data-worker)
[![npm version](https://badge.fury.io/js/data-worker.svg)](https://badge.fury.io/js/data-worker)
[![dependencies Status](https://david-dm.org/piyushgupta1/data-worker/status.svg)](https://david-dm.org/piyushgupta1/data-worker)
[![devDependencies Status](https://david-dm.org/piyushgupta1/data-worker/dev-status.svg)](https://david-dm.org/piyushgupta1/data-worker?type=dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A simple project enabling some cool data operations on large arrays

### Usage

```bash
# Run npm install
npm install data-worker

# Import Data worker in yout project
import DataWorker from 'data-worker';
```

### Features
- Works on Flat JSON's (for now)
- Create multiple level of grouping on Data passed via input
    - Flat grouping
    - Hierarchical Grouping

- Aggregation and many more coming soon...

### Examples

#### With nesting and order of elements maintained
```javascript
import DataWorker from 'data-worker';

const sampleData = [
  { dep: 'First Top', name: 'First child', model: 'value1', size: '320' },
  { dep: 'First Top', name: 'SECOND CHILD', model: 'value1', size: '320' },
  { dep: 'Second Top', name: 'First Child', model: 'value1', size: '320' },
  { dep: 'Second Top', name: 'SECOND CHILD', model: 'value1', size: '320' },
  { dep: 'Third Top', name: 'First Child', model: 'value2', size: '320' },
  { dep: 'Third Top', name: 'Second Child', model: 'value1', size: '320' },
]

 const dw = new DataWorker()
 dw.input(sampleData)
        .group(['dep', 'name'])
        .complete()

//result 
[
  {
    "key": "First Top",
    "values": [
      {
        "key": "First child",
        "values": [
          {
            "dep": "First Top",
            "name": "First child",
            "model": "value1",
            "size": "320"
          }
        ]
      },
      {
        "key": "SECOND child",
        "values": [
          {
            "dep": "First Top",
            "name": "SECOND child",
            "model": "value1",
            "size": "320"
          }
        ]
      }
    ]
  },
  {
    "key": "Second Top",
    "values": [
      {
        "key": "First child",
        "values": [
          {
            "dep": "Second Top",
            "name": "First child",
            "model": "value1",
            "size": "320"
          }
        ]
      },
      {
        "key": "SECOND child",
        "values": [
          {
            "dep": "Second Top",
            "name": "SECOND child",
            "model": "value1",
            "size": "320"
          }
        ]
      }
    ]
  },
  {
    "key": "Third Top",
    "values": [
      {
        "key": "First child",
        "values": [
          {
            "dep": "Third Top",
            "name": "First child",
            "model": "value1",
            "size": "320"
          }
        ]
      },
      {
        "key": "Second child",
        "values": [
          {
            "dep": "Third Top",
            "name": "Second child",
            "model": "value1",
            "size": "320"
          }
        ]
      }
    ]
  }
]
```

#### With flat and order of elements not manitained
```javascript
import DataWorker from 'data-worker';

const sampleData = [
  { dep: 'First Top', name: 'First child', model: 'value1', size: '320' },
  { dep: 'First Top', name: 'SECOND CHILD', model: 'value1', size: '320' },
  { dep: 'Second Top', name: 'First Child', model: 'value1', size: '320' },
  { dep: 'Second Top', name: 'SECOND CHILD', model: 'value1', size: '320' },
  { dep: 'Third Top', name: 'First Child', model: 'value2', size: '320' },
  { dep: 'Third Top', name: 'Second Child', model: 'value1', size: '320' },
]

 const dw = new DataWorker()
 dw.input(sampleData)
        .group(['dep', 'name'],true)
        .complete()

//result 
[
  {
    "dep": "First Top",
    "name": "First Child",
    "values": [
      {
        "dep": "First Top",
        "name": "First child",
        "model": "value1",
        "size": "320"
      }
    ]
  },
  {
    "dep": "First Top",
    "name": "SECOND Child",
    "values": [
      {
        "dep": "First Top",
        "name": "SECOND child",
        "model": "value1",
        "size": "320"
      }
    ]
  },
  {
    "dep": "Second Top",
    "name": "First Child",
    "values": [
      {
        "dep": "Second Top",
        "name": "First child",
        "model": "value1",
        "size": "320"
      }
    ]
  },
  {
    "dep": "Second Top",
    "name": "SECOND Child",
    "values": [
      {
        "dep": "Second Top",
        "name": "SECOND child",
        "model": "value1",
        "size": "320"
      }
    ]
  },
  {
    "dep": "Third Top",
    "name": "First Child",
    "values": [
      {
        "dep": "Third Top",
        "name": "First child",
        "model": "value1",
        "size": "320"
      }
    ]
  },
  {
    "dep": "Third Top",
    "name": "Second Child",
    "values": [
      {
        "dep": "Third Top",
        "name": "Second child",
        "model": "value1",
        "size": "320"
      }
    ]
  }
]
```

### How can I support developers?
- Star our GitHub repo :star:
- Create pull requests, submit bugs, suggest new features or documentation updates :wrench:
- Follow us on [Twitter](https://twitter.com/gpiyush_994) :feet:

### From The Creator
Made with :heart:. Follow us on [Twitter](https://twitter.com/gpiyush_994) to get the latest news first!
We're always happy to receive your feedback!