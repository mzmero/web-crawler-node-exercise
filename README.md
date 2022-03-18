# web-crawler-node-exercise

## Table of contents
* [Description](#Description)
* [Requirement](#Requirement)
* [Setup](#Setup)
* [Run the app](#Run-The-App)
* [Approaches](#Approaches)
* [Results](#Results)

## Description
In this task we are going to build a simple web crawler to fetch all images.

## Requirement
Running the code requires Node 16 or. above.

## Setup
To run this project, install it locally using npm
```
npm i
```
## Run The App
```
node crawler_stack.js <desired link> <desired depth>
```
or
```
node crawler_recursive.js <desired link> <desired depth>
```
## Approaches
There are two approaches for this task , the first uses recursive function while the other uses a stack , the recursive is faster but has its disadvantages
while the other is slow but can be improved with multitasking.
##### The stack approach calls for url and wait for every call till it finishes , since connection time doestn't effect cpu , the cpu is idle most of the time.
##### The recrusive aprroach is very fast ,but read from the json file everytime ,update the content and write it again to the file , in a case when we approach a very high size of json file , the read/write operations can be expensive.
##### First approach with stack called crawler_stack.js while the other  is called crawler_recursive.js

## Results
##### Results from each appreach are saved on results_recursive.json and results_stack.json
##### Both are saved on format of {imageUrl: string,sourceUrl: string ,depth: number }



