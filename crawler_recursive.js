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


//because its a recursive function , read from json and apply changes to it
async function add_images(images,url,depth){
    const { host, protocol } = urlParser.parse(url);
    images.forEach((img,i)=>{
        if(img.length>0){
            let _path;
            if(!img.startsWith("data:image"))
                _path = getURL({"host":host,"protocol":protocol,"link":img})
            else _path = img;
            try {
                const rawdata = fs.readFileSync('results_recursive.json');
                const imagesObj = JSON.parse(rawdata);
                imagesObj.push({"imageUrl":_path,"sourceUrl":url,"depth":depth})
                const temp= JSON.stringify(imagesObj)
                fs.writeFileSync("results_recursive.json", temp);
            } catch (error) {
                console.log(error)
            }
        }
    })
}

/*
check if depth doesn't exceed the maxDepth and if we visited the url before
fetch html and use cheerio to extract all links and images
call for save image function and call for each link recursively
*/

const crawl = async ({url,depth})=>{
    if(depth > maxDepth || seenURL[url])
        return 
    seenURL[url] =true;
    console.log(url)
    const html = await axios.get(url)
    .then(({data})=>{
       return data;
    })
    .catch((error)=> {
        //console.log(error.message);
    });
    if(typeof html ==="string"){
        const $ = Cheerio.load(html)
        const images = $("img").map((i,img)=>img.attribs.src).get()
        if(images.length > 0)
           await add_images(images,url,depth)
        const links = $("a").map((i,link)=>link.attribs.href).get()
        const { host, protocol } = urlParser.parse(url);
        links.forEach((link,i)=>{
            crawl({"url":getURL({"host":host,"protocol":protocol,"link":link}),"depth":depth+1})
        })
    }
    return ;
}

//call for first url recursively
function start (url){
   crawl({"url":url ,"depth":0})
}
//cli url
const originURL= process.argv[2]
const maxDepth = process.argv[3]
// open/overwrite result.json
fs.writeFileSync('results_recursive.json', JSON.stringify([]))
start(originURL)