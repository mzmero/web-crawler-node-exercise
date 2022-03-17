# web-crawler-node-exercise

## Table of contents
* [Description](#Description)
* [Requirement](#Requirement)
* [Setup](#Setup)
* [Run the app](#Run-The-App)
* [Approaches](#Approaches)
* [Max Depth](#Max-Depth)
* [Results](#Results)

## Description
In this task we are going to build a simple web crawler to fetch all images

## Requirement
The program has only been tested on Node 16.13.2

## Setup
To run this project, install it locally using npm
```
npm i
```
## Run The App
```
node crawler.js <desired link>
```
## Approaches
There are two approaches for this task , the first uses recursive function while the other uses a loop , the recursive is faster but has its disadvantages
while the other is slow but can be improved with multitasking.
##### First approach with loop called crawler.js while the other one is called crawler2.js

## Max Depth
The program has a max depth of 3 , you can freely change it .

## Results
##### Results from each appreach are saved on results.json and results2.json
##### Both are saved on format of {imageUrl: string,sourceUrl: string ,depth: number }



