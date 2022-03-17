import axios from 'axios'
import * as Cheerio from 'cheerio';
import fs from 'fs'
import * as urlParser from "url";


const seenURL=[]

//check url and apply a change depend on what type it is
function getURL({host,protocol,link}){
    if(link.includes('http'))
        return link;
    else if(link.startsWith('/')){
        return `${protocol}//${host}${link}`;
  } else {
    return `${protocol}//${host}/${link}`;
  }
}

//add images to result
function add_images(images,url,depth,stackObj){
    const { host, protocol } = urlParser.parse(url);
    images.forEach((img,i)=>{
        if(img.length>0){
            let _path;
        if(!img.startsWith("data:image"))
            _path = getURL({"host":host,"protocol":protocol,"link":img})
        else _path = img;
        stackObj.results.push({"imageUrl":_path,"sourceUrl":url,"depth":depth})
        }
    })
}

/*
check if depth doesn't exceed the maxDepth and if we visited the url before
fetch html and use cheerio to extract all links and images
call for save image function and add all new links to stack
*/
const crawl = async ({url,depth,stackObj})=>{
    if(depth > maxDepth || seenURL[url])
        return 
    seenURL[url] =true;
    const html = await axios.get(url)
    .then(({data})=>{
       return data;
    })
    .catch((error)=> {
        //console.log(url)
        console.log(error.message);
    });
    if(typeof html ==="string"){
        const $ = Cheerio.load(html)
        const images = $("img").map((i,img)=>img.attribs.src).get()
        if(images.length > 0)
            add_images(images,url,depth,stackObj)
        const links = $("a").map((i,link)=>link.attribs.href).get()
        const { host, protocol } = urlParser.parse(url);
        links.forEach((link,i)=>{
            stackObj.stack.push({"url":getURL({"host":host,"protocol":protocol,"link":link}),"depth":depth+1})
        })
    }
}

/*
create obj to save result and links
as long as there are links left pop and call for a link
when there is no links left save the result in results.json
*/
async function start (originURL){
    const stackObj = {"stack":[],"results":[]}
    stackObj.stack.push({"url":originURL,"depth":0})
    while(stackObj.stack.length>0){
        const {url,depth} = stackObj.stack.pop()
        await crawl({"url":url ,"depth":depth,"stackObj":stackObj})
    }
    const temp= JSON.stringify(stackObj.results)
    fs.writeFileSync("results_stack.json", temp);

}
const originURL= process.argv[2]
const maxDepth = process.argv[3]
start(originURL)
