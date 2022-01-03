const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const morgan = require('morgan');
const { render } = require('express/lib/response');

const app = express();

const dbURI = 'mongodb+srv://abs1289:abs%401289@cluster0.fhm2u.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology : true})
.then((result)=>{app.listen(3000); console.log('connected to db')})
.catch((err)=>console.log(err));//establishing database connection

app.set('view engine','ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'));

app.get('/',(req,res)=>{
    res.redirect('/blogs');
});
app.get('/about',(req,res)=>{
    res.render('about',{title : 'About'});
});
app.get('/blogs/create',(req,res)=>{
    res.render('create',{title : 'Create a new blog'});
});

//blog routes
app.get('/blogs',(req,res)=>{
    Blog.find()//.sort({ceatedAt:-1}) //for descending order
    .then((result)=>{
        res.render('index',{title:'All Blogs', blogs:result})
    }).catch((err)=>console.log(err));
})

app.post('/blogs',(req,res)=>{
    const blog = new Blog(req.body);

    blog.save()
    .then((result)=>{res.redirect('/blogs')})
    .catch((err)=>console.log(err));
})

app.get('/blogs/:id',(req,res)=>{
    const id = req.params.id;
    Blog.findById(id)
    .then((result)=>{
        res.render('details',{title:'Blog Details',blog:result});
    }).catch((err)=>{
        console.log(err);
        res.status(404).render('404',{title : 'Blog not found'});
    });
})

app.delete('/blogs/:id',(req,res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect:'/blogs'});
    }).catch((err)=>console.log(err));
})

app.use((req,res)=>{
    res.status(404).render('404',{title : '404'});
});