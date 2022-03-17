import axios from 'axios'
import * as Cheerio from 'cheerio';
import fs from 'fs'
import * as urlParser from "url";


const maxDepth = 3;
const seenURL=[]

function getURL({host,protocol,link}){
    if(link.includes('http'))
        return link;
    else if(link.startsWith('/')){
        return `${protocol}//${host}${link}`;
  } else {
    return `${protocol}//${host}/${link}`;
  }
}


async function add_images(images,url,depth){
    const { host, protocol } = urlParser.parse(url);
    images.forEach((img,i)=>{
        if(img.length>0){
            let _path;
        if(!img.startsWith("data:image"))
            _path = getURL({"host":host,"protocol":protocol,"link":img})
        else _path = img;
        const temp= JSON.stringify({"imageUrl":_path,"sourceUrl":url,"depth":depth})
        fs.writeFileSync("results.json", temp);
        //results.push({"imageUrl":_path,"sourceUrl":url,"depth":depth})
        }
    })
}

const crawl = async ({url,depth})=>{
    if(depth > maxDepth || seenURL[url])
        return 
    seenURL[url] =true;
    const html = await axios.get(url)
    .then(({data})=>{
       return data;
    })
    .catch((error)=> {
        console.log(error.message);
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

function start (url){
   crawl({"url":url ,"depth":0})
}
const originURL= process.argv[2]
start(originURL)
