const http = require('http')
const my_https = require('./module/my_https.js').my_https
const fs = require('fs')
const port = 80;

const server = http.createServer((req,res)=>{

    const url = req.url;
    const url_arr = req.url.split('/')
    console.log('[url]',url)

    function _404(res, url, err){
        //console.error('_404 fn err', url, err)
        res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
        res.end('404 Page Not Found');
    }

    function fs_readfile(res, url, encode, file_type, callback){
        //console.log('fs_readfile', url)
        var name = url.split('/').reverse()[0]
        var url_arr = url.split('/');
        if ( name.includes('.html')) file_type='text/html; charset=utf-8';
        if ( name.includes('.css')) file_type='text/css; charset=utf-8';
        
        fs.readFile(url, encode, (err,data)=>{
            if(err){ 
                console.error('[error] fs_readfile', err, url, encode, file_type)
                res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
                res.end('Page Not Found');
            }else{
                res.writeHead(200, {'Content-Type':file_type});
                res.end(data)
            }
        })
    callback();
    }

    if(url=='/') fs_readfile(res,'asset/index.html', 'utf8', 'text/html; charset=utf-8', ()=>{})
    else if(url=='/main.css') fs_readfile(res,'asset/main.css', 'utf8', 'text/css; charset=utf-8', ()=>{})
    else if(url=='/map.js') fs_readfile(res,'asset/map.js', 'utf8', 'text/javascript; charset=utf-8', ()=>{})
    else if(url=='/favicon.ico') fs_readfile(res,'asset/favicon.ico', null, 'image/x-icon', ()=>{})
    else if(url_arr[1]=='img' && url_arr[2]=='map'){
        var file_path = 'mapimg/'+url_arr.slice(3).join('/')+'.png';
        //console.log('[mapimg]', file_path);
        
        fs.readFile(file_path, null, (err,data)=>{
            if(err){ 
                let request_url = `https://map0.daumcdn.net/map_2d/2106wof/L${url_arr[3]}/${url_arr[4]}/${url_arr[5]}.png`
                console.log(request_url, url_arr);
                my_https(request_url,(data)=>{
                    if(!data){
                        _404(res,url, 'internet error, img can not down');
                        return;
                    }else{
                        //console.log('my_http',typeof data, data.length, 'dirpath')
                        res.writeHead(200, {'Content-Type':'image/png'});
                        res.end(data)

                        dirpath = `mapimg/${url_arr[3]}`
                        try{fs.readdirSync(dirpath)
                        }catch{fs.mkdirSync(dirpath);}

                        dirpath += `/${url_arr[4]}`
                        try{fs.readdirSync(dirpath)
                        }catch{fs.mkdirSync(dirpath);}
                        fs.writeFile(file_path, data, ()=>{})
                                                
                    }
                })
            }else{
                res.writeHead(200, {'Content-Type':'image/png'});
                res.end(data)
            }
        })

    }
//    else if(url_arr[1]=='static'){
//        var file_path = url_arr.splice(1).join('/')
//        fs_readfile(res,'asset/'+file_path, null, 'text/html; charset=utf-8', ()=>{})
//    }
//    else if(url_arr[1]=='js'){
//        var file_path = url_arr.splice(1).join('/')
//        fs_readfile(res,'asset/'+file_path, null, 'text/html; charset=utf-8', ()=>{})
//    }
    else _404(res,url, 'Page Not Found, else;');
})

server.listen(port,()=>{console.log(`Server is running at localhost:${port}`)})