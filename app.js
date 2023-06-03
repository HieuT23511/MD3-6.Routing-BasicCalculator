const http = require('http')
const fs = require('fs')
const qs = require('qs');
const url = require('url')
const port = 8080;
let handlers = {};
const server = http.createServer((req, res) => {
    let urlPathName = url.parse(req.url).pathname

    if (req.method === "GET") {
        let choseRouter = (typeof router[urlPathName] !== 'undefined') ? router[urlPathName] : handlers.notFound;
        choseRouter(req, res);
    } else {
        let choseRouter = handlers.result;
        choseRouter(req,res);
    }

})
server.listen(port, 'localhost', () => {
    console.log(`Server is running at http://localhost:${port}/calculator`);
})

handlers.calculator = (req, res) => {
    fs.readFile('./views/calculator.html', "utf-8", (err, dataHTML) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(dataHTML);
        return res.end();
    })
}
handlers.notFound = (req, res) => {
    fs.readFile('./views/notfound.html', "utf-8", (err, dataHTML) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(dataHTML);
        return res.end();
    })
}
handlers.result = (req, res) => {
    let data = '';
    req.on("data", chunk => {
        data += chunk
    })
    req.on("end", () => {
        data = qs.parse(data)
        let result = eval(`${data.input1} ${data.operator} ${data.input2}`);
        console.log(typeof (result));
        let stringObject = `<h1>The result is: ${result}</h1>`
        fs.writeFile('./views/result.html',stringObject,(err)=>{
            if (err){
                console.log(err.message);
            } else {
                fs.readFile('./views/result.html',"utf-8",(err, dataHTML)=>{
                    res.writeHead(200,{'Content-Type':'text/html'});
                    res.write(dataHTML);
                    return res.end();
                })
            }
        })
    })
    req.on("error", () => {
        console.log("error")
    })
}
let router = {
    "/calculator": handlers.calculator,
    "/result": handlers.result
}


