import axios from 'axios'


const craw =async ({url})=>{
    const response= await axios.get(url)
    .then(({data})=>{
       return data;
    }).catch( (error)=> {
        console.log(error);
      });
    console.log(response)
}

craw({"url":"http://crawler-test.com/redirects/redirect_target"})