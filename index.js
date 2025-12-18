// Server file: index.js

import express from "express";
// 1. Import 'path' module from Node.js standard library
import path from "path"; 
import { fileURLToPath } from "url"; // Needed to resolve __dirname in ESM
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let postIdCounter = 1;
const posts = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); 

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

-

app.get("/", (req, res) => {
    res.render('index', { posts: posts });
});

app.get("/new", (req, res) => {
    res.render('post'); 
});

app.post('/submit-post', (req, res) => {
    const newPost = {
        id: postIdCounter++,
        title: req.body.postTitle, 
        body: req.body.postBody    
    };
    
    posts.push(newPost);
    console.log('New Post Submitted:', newPost.title, 'ID:', newPost.id);
    
    res.redirect('/');
});
// Route 4: GET EDIT FORM - Renders the form pre-filled with data
app.get("/edit/:id", (req, res) => {
    // 1. Get the ID from the URL parameter
    const postId = parseInt(req.params.id);
    
    // 2. Find the post in the array
    const postToEdit = posts.find(post => post.id === postId);

    if (postToEdit) {
        // 3. Render the edit view, passing the specific post data
        res.render('edit', { post: postToEdit });
    } else {
        res.status(404).send('Post not found');
    }
});

// Route 5: POST UPDATE HANDLER - Receives the updated data
app.post("/update/:id", (req, res) => {
    // 1. Get the ID from the URL
    const postId = parseInt(req.params.id);

    // 2. Find the index of the old post
    const postIndex = posts.findIndex(post => post.id === postId);

    if (postIndex > -1) {
        // 3. Create the updated post object
        const updatedPost = {
            id: postId, // Keep the original ID
            title: req.body.postTitle,
            body: req.body.postBody
        };
        
        // 4. Replace the old post object with the new one
        posts[postIndex] = updatedPost;
        console.log('Post Updated:', updatedPost.title);
        
        // 5. Redirect back to the homepage
        res.redirect('/');
    } else {
        res.status(404).send('Post to update not found');
    }
})
app.post("/delete/:id", (req, res) => {
    // 1. Get the ID from the URL
    const postId = parseInt(req.params.id);

    // 2. Find the index of the post to delete
    // We use findIndex because we need the position in the array to use splice
    const postIndex = posts.findIndex(post => post.id === postId);

    if (postIndex > -1) {
        // 3. Remove the post from the array using splice(index, how_many_to_remove)
        posts.splice(postIndex, 1);
        console.log('Post Deleted. ID:', postId);
        
        // 4. Redirect back to the homepage
        res.redirect('/');
    } else {
        res.status(404).send('Post to delete not found');
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Homepage: http://localhost:${port}/`);
    console.log(`New Post Form: http://localhost:${port}/new`);
});