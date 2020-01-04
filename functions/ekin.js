require('dotenv').config()
const puppeteer = require('puppeteer-core');

exports.handler = async (event, context) => {

    let chromium = null

    let opts = {
        executablePath: process.env.CHROME_PATH
    }


    if(process.env.NODE_ENV === 'production') {
        chromium = require('chrome-aws-lambda');
        opts = {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        }
    }

    const pageToScreenshot = JSON.parse(event.body).pageToScreenshot;

    if (!pageToScreenshot) return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Page URL not defined' })
    }

    const browser = await puppeteer.launch(opts)
    
    const page = await browser.newPage();

    await page.goto(pageToScreenshot, { waitUntil: 'networkidle2' });

    const screenshot = await page.screenshot({ encoding: 'binary' });

    await browser.close();
  
    return {
        statusCode: 200,
        body: JSON.stringify({ 
            message: `Complete screenshot of ${pageToScreenshot}`, 
            buffer: screenshot 
        })
    }

}