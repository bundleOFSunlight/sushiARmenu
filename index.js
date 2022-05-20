const express = require('express');
const app = express(); //create express app
const port = process.env.PORT || '3000'
const baseUrl = process.env.baseURL || "http://localhost:3000"
const axios = require('axios');
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: "daqm1fsjr", // add your cloud_name
    api_key: "894691875326772", // add your api_key
    api_secret: "Gbl79rEsA_l41TRnxPbQ2AXIJsM", // add your api_secret
    secure: true
});

app.use(express.static('public'));

//adding middleware to our Express stack 
// Express comes with express.static middleware to serve static files
// pass in the relative path directory
// Any requested files in the directory “static” are served.
/*
Suppose you make a request like localhost:3000/hello.html, 
Express looks up the files in the static directory if the file exists then returns hello.html.*/
//----------------------------------------------------------------------------------------

app.get("/", (req, res) => {
    res.send("This is from express.js");
});


// tells the express app how to handle an HTTP GET request to our server. 
// first parameter : route or path which is the relative path from the root of the server;
// 2nd parameter : function to be invoked when there is request to this path
// In this case, we are listening for GET requests to / which is the root of the website.
// ==========================================================================================

app.get('/api', async function (req, res) {

    var urlDict = {};
    var expression = 'folder:' + 'demo';
    cloudinary.v2.search.expression(expression // add your folder
    ).sort_by('public_id', 'desc').max_results(30).execute().then(result => {
        const videos = result.resources;

        videos.forEach((element, index) => {
            urlDict[index] = element.url;
        });

        res.json(urlDict);


    }).catch(error => console.error(error));

}

);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


// app.get('/api/ukyd', function async(req, res) {
//     console.log('helllo');
//     console.log(req.query);

//     var response = {
//         restaurant_name: req.query.restaurant_name.split(' ').join('-'), //replace spaces with dashes
//         media: req.query.media,
//     }
//     var urlDict = {};


//     if (response.media == "Videos") {
//         var expression = 'folder:' + response.restaurant_name + '-videos';
//         cloudinary.v2.search.expression(expression // add your folder
//         ).sort_by('public_id', 'desc').max_results(30).execute().then(result => {
//             const videos = result.resources;

//             videos.forEach((element, index) => {
//                 urlDict[index] = element.url;
//             });

//             //res.json(JSON.stringify(urlDict));
//             res.json(urlDict);


//         }).catch(error => console.error(error));
//     } else if (response.media == "Images") {
//         var _prefix = response.restaurant_name + '-img';
//         cloudinary.v2.api.resources({
//                 resource_type: 'image',
//                 type: 'upload',
//                 prefix: _prefix,
//             })
//             .then(result => {
//                 const images = result.resources;

//                 images.forEach((element, index) => {
//                     urlDict[index] = element.url;
//                 });
//                 res.json(urlDict);
//                 // res.end(JSON.stringify(urlDict));
//             })
//             .catch(error => console.error(error));
//     }
//     console.log((`finished fetching ${response.media} URLs from ${response.restaurant_name}`));

// }

// );