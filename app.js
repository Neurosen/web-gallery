var express = require('express'),
    fs = require('fs'),
    im = require('imagemagick'),
    uuid = require('node-uuid'),
    app = express.createServer(),	
    config = {
        port:80,
        temp_dir:'./temp/',
        upload_dir:'./public/images/',
        public_dir:'/public/',
        public_images_url:'/images/',
        path_big:'big/',
        path_small:'small/'
    },
    Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    db = new Db('test', new Server("127.0.0.1", 27017, {auto_reconnect: true}), {});

app.use(express.static(__dirname + config.public_dir));
app.use(express.bodyParser({uploadDir:config.temp_dir}));
app.set('view engine', 'ejs');
app.set('view options', {
    layout:false
});

db.open(function(err, db) {

    if (err) console.log(err);
    app.get('/', function(req, res) {

        db.collection('images', function(err, collection) {
		        
            collection.find().toArray(function(err, item) {

		        res.render('index', {
                    images:item
                }); 
            });  
	    //db.close();
        });
    });

    app.get('/uploadImages', function(req, res) {
	    
        res.render('imagesUploader');
    });

    app.get('/aboutUs', function(req, res) {
	    
        res.render('aboutUs');
    });

    app.get('/albums', function(req, res) {
	    
        res.render('albums');
    });

    app.post('/albums', function(req, res) {
	    
        res.render('albums');
    });

    app.put('/albums', function(req, res) {
	    
        res.render('albums');
    });

    app.delete('/albums', function(req, res) {
	    
        res.render('albums');
    });

    app.post('/uploadImages', function(req, res) {
	    		    
        var length = req.files.images.length;
            tmp_path = '',
            target_path = '',
            file_extension = '',
            file_name = '',
            description = '',
            i = 0,
            album = '',
            image_title = '';
        
        for (i = 0; i < length; i++) {
            if(typeof req.files.images[i] !== 'undefined') {
                tmp_path = req.files.images[i].path;
                file_extension = '.' + req.files.images[i].name.split('.').pop();
                file_name = uuid.v1() + file_extension;
                target_path_big = config.upload_dir + config.path_big + file_name;
                target_path_small = config.upload_dir + config.path_small + file_name;
                album = req.body.album;            
 
                image_title = 'Untitled image';
                description = 'No description';
            
                if(req.body.imageTitles[i] != '') image_title = req.body.imageTitles[i];
                if(req.body.imageDescriptions[i] != '') description = req.body.imageDescriptions[i];
            
                db.collection('images', function(err, collection) {
		        
                    collection.insert({
                        imageId: file_name,
                        title: image_title,
                        album: album,
                        big: config.public_images_url + config.path_big + file_name,
                        small: config.public_images_url + config.path_small + file_name,
                        description: description
                    });  
	                //db.close();
                });

                im.convert([target_path_big, '-resize', '268x360', target_path_small], function(err, stdout) {

                    if (err) console.log(err);           
                });

                fs.rename(tmp_path, target_path_big, function(err) {
                    
                    if (err) console.log(err);
                    fs.unlink(tmp_path, function() {

                        if (err) console.log(err);
                    });
                });  
            };      
        }
        res.redirect('/');
    });
    
    app.delete('/deleteImage', function(req, res) {

        var imageId = req.query['imageId'];
        fs.unlink(config.upload_dir + config.path_big + imageId, function() {
            
            if (err) console.log(err);
        });

        fs.unlink(config.upload_dir + config.path_small + imageId, function() {
            
            if (err) console.log(err);
        });

        db.collection('images', function(err, collection) {
		        
            collection.remove({imageId: imageId}); 
            //db.close();
        });      
        res.status(200).send('OK');
    });

    app.put('/editImage', function(req, res) {

        var imageId = req.body.imageId,
            title = req.body.title,
            description = req.body.description;

        db.collection('images', function(err, collection) {
		        
            collection.update({imageId: imageId}, {$set: {title: title, description: description} }); 
            //db.close();
        });      
        res.status(200).send('OK');
    });

    app.listen(config.port);
    console.log("Server started at port", config.port);
});
