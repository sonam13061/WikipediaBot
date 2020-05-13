let request=require("request");
let cheerio=require("cheerio");
let fs=require("fs");
let puppeteer = require("puppeteer");
console.log("Before");


//let x=process.argv[2];
(async function(){
    let browser = await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        args:["--start-maximized","--use-fake-ui-for-media-stream"]
        //slowMo:10
    });
    let pages = await browser.pages();
    let page = pages[0];
    //let newpage=await browser.newPage();
    let arr=["Computer_networks","Recursion_(computer_science)","Greedy_algorithm"];
   let requestwillbesentpromise= getRequest("https://en.wikipedia.org/wiki/"+arr[0]);
   for(let i=1;i<arr.length;i++){
       requestwillbesentpromise=requestwillbesentpromise.then(async function(body){
          await  parsehtml(body,page,browser);
           let nextrequestwillbesentpromise=getRequest("https://en.wikipedia.org/wiki/"+arr[i]);
           return nextrequestwillbesentpromise;
       })
   }
   requestwillbesentpromise.then(async function(body){
    await  parsehtml(body,page,browser);
   })
})();
function getRequest(url){
    return new Promise(function (resolve, reject) {
    request(url, function(err,res,html){
        if(err==null && res.statusCode===200){
         //parsehtml(html,page,browser);
           resolve(html)
            //console.log("file written");
        }
        else if(res.statusCode===404){
            console.log("Invalid page");
            reject();
        }
        else{
            reject();
            console.log(err);
            console.log(res.statusCode);
        }
    });
});
}
 





async function parsehtml(html,page,browser){

    let $=cheerio.load(html);
    let firstparagraph=$(".mw-parser-output p");
    let i=0;
    while(true){
   let classname= $(firstparagraph[i]).attr("class");
   if(classname==null){
       break;
     }
    i++;
    }
    let text=$(firstparagraph[i]).text();
     await fs.writeFileSync("abc.txt",text);
     
     
     await page.goto("https://www.naturalreaders.com/online/",{waitUntil:"networkidle2"});
    //  await page.waitForSelector("button[mattooltip=Clear Texts]",{visible:true});
    //  await page.click("button[mattooltip=Clear Texts]");
    await page.waitForSelector(".text-box");
    await page.focus(".text-box");
   await page.keyboard.down('Control');
   await page.keyboard.press('A');
   await page.keyboard.up('Control');
   await page.keyboard.press('Backspace');
    //await page.keyboard.type('foo');
    await page.type(".text-box",text);
   
      let newpage=await browser.newPage();
      await newpage.goto("https://online-voice-recorder.com/"); 
     await newpage.waitForSelector(".btn-record",{visible:true});
     await newpage.click(".btn-record");
     let c3time=Date.now();
     while(Date.now()<=c3time+2000)
     {
     }
     await page.bringToFront();
      blockingWait(2);
    await page.click(".option.playPause.play");
    let ctime = Date.now();
    while(Date.now()<=ctime+37000)
    {
    }
    await newpage.bringToFront();
    blockingWait(2);
     await newpage.waitForSelector(".btn-record.active",{visible:true});
     await newpage.click(".btn-record.active");
     await newpage.waitForSelector(".btn-save",{visible:true});
     await newpage.click(".btn-save");
     let c2time=Date.now();
     while(Date.now()<=c2time+10000)
     {
     }
    //  await page.bringToFront();
    //   blockingWait(2);
      await newpage.close();
    //console.log(text);

}
function blockingWait(seconds) {
    //simple blocking technique (wait...)
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while(waitTill > new Date()){}

}
  
       