# DRAFT: pubfood

[![npm version](https://badge.fury.io/js/pubfood.svg)](https://badge.fury.io/js/pubfood)
[![Build Status](https://travis-ci.org/pubfood/pubfood.svg?branch=master)](https://travis-ci.org/pubfood/pubfood)


A browser client header bidding JavaScript library.

# What is header bidding?

![Header Bidding Overview](doc/header-bidding-overview.png?raw=true "Header Bidding Overview")

It's what we (YB) do; on pageview:

- Publisher site code asks all partners, Yieldbot included, if we have an ad that meets the quality and performance of the page/slot;
- The Yieldbot and other platforms answer with a y/n:
    - `If y: the CPM offer is provided to the publisher ad server`
- The publisher ad server has the ultimate decision which partner "wins" the impression
    - `The winner may depend on other business rules defined in the publisher ad server; not just the CPM bid`

# Architecture Overview

![Architecture Overview - Requests](doc/pubfood-api-flow-requests.png?raw=true "Architecture Overview - Requests")
![Architecture Overview - Creative](doc/pubfood-api-flow-creative.png?raw=true "Architecture Overview - Creative")
![Architecture Overview - Report](doc/pubfood-api-flow-report.png?raw=true "Architecture Overview - Report")

# Design Models

## Auction State
![Auction State](doc/pubfood-bid-slot.png?raw=true "Internal Auction State")

# Build Tasks

## Build

- `npm run prepare`
- `npm run build`

## Test

- `npm run test`

## Start
Opens the `test/index.html` file in your default browser.

- `npm start`

## Build Output

- `build/doc/index.html` _(...etc, JSDoc)_
- `build/pubfood.js`
- `build/pubfood.min.js`

## Deploy Process

- `npm run cut_deploy`
- `git fetch`
- `git rebase`
- `git push`
- `git push origin --tags`
- check the [travis build](https://travis-ci.org/pubfood/pubfood)

# References
Some reasonable summaries if you're new to header bidding:

- http://adexchanger.com/publishers/the-rise-of-header-bidding-and-the-end-of-the-publisher-waterfall/
- http://www.adopsinsider.com/ad-exchanges/diagramming-the-header-bidding-redirect-path/
