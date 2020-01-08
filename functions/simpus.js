// eslint-disable-next-line require-await
const request = require('request')
const cheerio = require('cheerio')
const SIMPUS_URL = process.env.SIMPUS_URL


exports.handler = async (event, context) => {
  const User = JSON.parse(event.body)

  try{
    return await new Promise( resolve => {
      request(SIMPUS_URL, {
        method: 'POST',
        followAllRedirects: true,
        jar: true,
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.46 Safari/537.36"
        },
        form:{
          _method:'POST',
          data: {
            User
          }
        }
      }, (error, response, body) => {
        error && console.log('error:', error) && resolve({
          statusCode: 500,
          body: JSON.stringify(error)
        }); // Print the error if one occurred
        // console.log(response)
        response && response.statusCode && console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
        if(body) {
          const $ = cheerio.load(body)
          const rightHTML = $('.home_right').html()
          if(rightHTML) {
            resolve({
              statusCode: 200,
              body: $('.home_right').html()
            })
          }
        } 
        resolve({
          statusCode: 401,
          body:'username atau password salah'
        })
      })
    })
  
  }catch(e){
    return {
      statusCode: 500,
      body: e
    }
  }
}