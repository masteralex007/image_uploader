var express = require("express");
var app = express();
var multer = require("multer");
var ejs = require("ejs");
var path = require("path");


//set file storage- for defining the storage of our image
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename:  function(req, file, callback){
        callback(null, file.fieldname +'-' + Date.now() +
        path.extname(file.originalname));
    }
});

//check file type
function checkFileType(file, callback){
    //for allowed extension
    const filetypes = /jepg|jpg|gif|png/;
    // check Etension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype); // here, we can see that we have extracted mime type from the file

    if(mimetype && extname){
        return callback(null, true);
    } else{
        return callback("Error: Images Only!");
    }
}

//initiallize upload- for uploading the image 
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, callback){
        checkFileType(file, callback)
    }
}).single("myImage");


app.use(express.static('public'));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index");
});

//post route for uploading images

app.post("/upload", function(req, res){
    upload(req, res, function(err){
        if(err){
            res.render("index", {msg: err});
        } else{
            // console.log(req.file);// heere file contains all the information about the uploaded image so, we can usen req.file to extract any info
            // res.send("test");
            if(req.file == undefined){
                res.render('index',{
                    msg: "Error: No File Selected"
                });
            } else{
                res.render("index", {
                    msg: "File Uploaded",
                    file: "uploads/" + req.file.filename //fetching filename from file   
                });
            }
        }
    });
});


app.listen(3000, function(){
    console.log("server is listnng at port 3000");
});