var myDB = new Firebase('https://cisc479-project4.firebaseio.com/');
/*
where "thing" = {number: 1} and "ss"(snapshot) = [{SLKFJSDLK: {number: 1}}, {DSKSKLF: {number:2}},....]
var myDB = new Firebase("https://cse.firebaseio.com/");
myDB.on('value', function(ss){
    ss.forEach(function(thing){
        document.querySelector('div').innerHTML += thing.val().number;
    });
});
*/

var postList =[];

var PREVIEWCHARLIMIT = 100;

var postLID = postList.length;

var postListLoaded = false;

//Load posts to array from database
//**note: postLID must be initialized before loading
myDB.child('posts').on("value", function(snapshot){
     if (!postListLoaded){
        initializePostListFromDB(snapshot);     
     }
     console.log("DB POSTS: " + snapshot.val());
});


var addPostToDB = function(post){
   //var id = post.id.toString();
   //myDB.child('posts').set({id : post});
   myDB.child('posts').push(post);
};

var deletePostFromDB = function(post){
    myDB.child('posts').once("value", function(snapshot){
        snapshot.forEach(function(item){
        console.log("searching for " + post.title + ", id: " + post.id)
           console.log("looking at " + item.val().title + ", id: " + item.val().id);
           if(item.val().title == post.title){
               console.log("FOUND ITEM !!!!! " + item.val().title);
               console.log("going to remove " + item.key());
                myDB.child('posts/' + item.key()).remove();
                console.log("removed item");
                //alert(post.title+" has been deleted from the database");
           }
        });
    });
}



    


var Post = function(id, title, content, author){
    this.id = postLID;
    this.title = title;
    this.content = content;
    this.author = author;
    this.date = new Date; // figure out date function
};

Post.prototype.toString = function(){
        return "[Title: " + this.title + "]";
    };
    
Post.prototype.getPreviewText = function(){
        if (this.content.length > PREVIEWCHARLIMIT){
            return this.content.slice(0, PREVIEWCHARLIMIT) + "...";
        }
        else{return this.content;}
    };
    


var newId = function(post){
    var post = new Post();
    if (postList.indexOf(post) == 0){
        post.id = 0;
    }else{
        for(var i=1; i<postList.length; i++){
            console.log("id="+post.id);
            post.id = post.id+1;
            console.log("new id="+post.id);
        }
    }
    return post.id;
}

postList.forEach(newId, Post);


//TEST OBJECTS
var postTest1 = new Post(11, "hei", "hei content", "authorananyamous");
var postTest2 = new Post(10, "hay", "hay content", "authorananyamous");
var postListTest2 = [postTest1, postTest2];
//myDB.set({'postDB': postListTest2});


//HOME PAGE
var posthead = document.querySelector('.posthead');
var postbody = document.querySelector('.postbody');//preview text


//INDIVIDUAL POST PAGE
var posttitle = document.querySelector('.posttitle');
var posttext = document.querySelector('.posttext');//full text

var container = document.querySelector('.container');



//MODEl----------------------------------------------------------------------------------------
//create post & add to postList, then rerender list
//called when user creates a post
var addPost = function(id, title, content, author){
    var newPost = new Post(id, title, content, author);
    postList.push(newPost);
    addPostToDB(newPost);
    container.innerHTML = '';
    postListView(postList);
    postLID ++;
}

//called on page load to populate js postList from DB
var initializePostListFromDB = function(snapshot){
    //make new Post object for each DB post and push to PostList array
    snapshot.forEach(function(item){
        loadPostFromJSON(item.val());
    });
    postListLoaded = true;
    //draw PostList
    container.innerHTML = '';
    postListView(postList);
    console.log("---------loaded postList");    
}


//add post to array from JSON object (for loading DB posts only -- does NOT rerender list)
var loadPostFromJSON = function(object){
    if ("author" in object && "title" in object && "content" in object && "id" in object){
        postList.push(new Post(object.id, object.title, object.content, object.author));
        postLID ++;
    }
    else{
        console.log("JSON object missing some Post attribute. Did not addPost for this object.");
    }
}


//delete post
var deletePost = function(post){
    console.log("post id =" +post.id);
    
    var d = confirm("delete fr, tho?");
    
    if (d == true){
        alert(post.title+" has been deleted");       
        deletePostFromDB(post);
        postList.splice(post.id,1);
     
        console.log("deleted id="+post.id);
        //go back to homepage after deletion
        homepage(postList);
    }
    else{
        return 0;
    }

    
};



//VIEW-----------------------------------------------------------------------------------------

//render single full post view
var renderSinglePost = function(post){
    var $posttitle = document.createElement("H1");
    $posttitle.className = "posttitle";
    var $posttextDiv = document.createElement("DIV");
    $posttextDiv.className = "posttext";
    var $postdate = document.createElement("P");
    $postdate.className = "postdate";
    
    var title = document.createTextNode(post.title);
    var text = document.createTextNode(post.content);
    var date = document.createTextNode(post.date);

    $posttitle.appendChild(title);
    //$posttextDiv.appendChild(text); //uncomment to return to plain text submissions
    $posttextDiv.innerHTML=post.content; //note: this allows embedded links but "unsafe"
    $postdate.appendChild(date);

    document.querySelector('.container').appendChild($posttitle);
    document.querySelector('.container').appendChild($posttextDiv);
    document.querySelector('.container').appendChild($postdate);

};


// renders full* single view PAGE including view post list button and title
var singlePostView = function(post){
    var $blogTitle = document.createElement('h1');
    $blogTitle.innerHTML="WYS";
    $blogTitle.classList.add('blogtitle');
    document.querySelector('.container').appendChild($blogTitle);
    
    var $switchbutton = document.createElement("button");
    $switchbutton.type ="button";
    $switchbutton.innerHTML = "next post";
    
    $switchbutton.setAttribute("href", post.id);
    $switchbutton.addEventListener('click', function(e){ //idk if need seperate to controller
        nextpost(post.id);
        console.log(post.id);
    });
    
    
    var $prevbutton = document.createElement("button");
    $prevbutton.type ="button";
    $prevbutton.innerHTML = "previous post";
    
    $prevbutton.setAttribute("href", post.id);
    $prevbutton.addEventListener('click', function(e){ //idk if need seperate to controller
        previouspost(post.id);
        console.log(post.id);
    });
    
    var $deletebtn = document.createElement("BUTTON");
    var erase = document.createTextNode("X");
    $deletebtn.appendChild(erase);
    document.querySelector('.container').appendChild($deletebtn);
    
    $deletebtn.addEventListener('click', function(e){
        deletePost(post);
    });  ///////deletepost
    
    document.querySelector('.container').appendChild($prevbutton);
    document.querySelector('.container').appendChild($switchbutton);
    
    renderSinglePost(post); 
    
};



//make single post preview module
var makePreview = function(post, postListContainer){
    var postDiv = document.createElement("DIV");
    postDiv.className = "post";
    var headDiv = document.createElement("DIV");
    headDiv.className = "posthead";
    var link = document.createElement("a");
    //console.log("undefined post: " + post);
    link.setAttribute("href", "#post" + post.id); //update later..
    
    postDiv.setAttribute('id', "#post" + post.id);
    console.log("POSTID " + post.id + " postLID " + postLID);
    
    var h2 = document.createElement("h2");
    var title = document.createTextNode(post.title);
    
    var bodyDiv = document.createElement("DIV");
    bodyDiv.className = "postbody";
    var para = document.createElement("P");
    
    //NOTE: this only works on instantiated Post objects, NOT JSON objects
    var text = document.createTextNode(post.getPreviewText());
    //body
    para.innerHTML = post.getPreviewText(); //note: allows embedded links but unsafe
    //para.appendChild(text); //uncomment to return to plain text submission
    bodyDiv.appendChild(para);
    //head 
    h2.appendChild(title);
    link.appendChild(h2);
    headDiv.appendChild(link);
    //post container
    postDiv.appendChild(headDiv);
    postDiv.appendChild(bodyDiv);
    postListContainer.appendChild(postDiv);
};


//render post list (previews of all posts)
var renderPostList = function(postList){
    var postListContainer = document.createElement("div");
    postListContainer.setAttribute('id', '#postListContainer');
    container.appendChild(postListContainer);
    for(var i = postList.length-1; i>=0; --i){
        makePreview(postList[i], postListContainer);
        console.log(postLID);
    }
};



// renders full* postlist view page including title and other elements if need
var postListView = function(postList){
    var $blogTitle = document.createElement('h1');
    $blogTitle.innerHTML="WYS";
    $blogTitle.classList.add('blogtitle');
    document.querySelector('.container').appendChild($blogTitle);
    renderPostList(postList);

    
};



//toggle modal
function overlay() {
    var	el = document.querySelector(".overlay");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
	//clear form 
	document.querySelector("#inTitle").value = "";
    document.querySelector("#inText").value= "";
}

//CONTROLLER --------------------------------------------------------------------------------

var homepage = function(postList){
    container.innerHTML = '';
    console.log(postList);
    postListView(postList);
};




// location routing with hash
var handleHash = function(){
        var postId = location.hash.substring(5);
        if (postId.length >=1){
          specificPage(postId);
          console.log("specific page plea");
        } else {
          homepage(postList);
          console.log("hom");
        }
        console.log(postId);
        
};

window.addEventListener("hashchange", handleHash);
window.addEventListener("load", handleHash);

var loadSinglePost = function(id){
          var thePost = {};
          postList.forEach(function(post){
            if (post.id == id){
              thePost = post;
            }
});
        
        container.innerHTML = '';
        singlePostView(thePost);

};


 var specificPage = function(id){
         loadSinglePost(id);
       };
       


var nextpost = function(postIndex){
    
            postIndex = (postIndex + 1) % postList.length;
            
            document.location = "#post" + postIndex;
          //loadSinglePost(postList[postIndex].id);
          //postIndex = (postIndex + 1) % postList.length;
          
       };
       
var previouspost = function(postIndex){
    
            //postIndex = (postIndex - 1) % postList.length;
            
            if(postIndex > 0){
                postIndex = postIndex - 1
            }else{
                postIndex = postList.length - 1;
            }
            
            document.location = "#post" + postIndex;
          //loadSinglePost(postList[postIndex].id);
          //postIndex = (postIndex + 1) % postList.length;
          
       };
       

//save new post input from modal
var savePost = function(){
  console.log("save post called");
    //tinyMCE.triggerSave();
    var newTitle = document.querySelector("#inTitle").value;
    var newText = document.querySelector("#inText").value;
    var newAuthor = "Shakespeare";
    
     if (newText.length > 0 && newTitle.length >0){
         
        //This should reject any use of angle brackets except for iframes
            var angles = new RegExp(/<[^>]*>/);
            var frames = new RegExp(/<iframe.*?>/);
            var breaks = new RegExp(/<br.*?>/);
            
        if(angles.exec(newText) && (!(frames.test(newText))) && (!(breaks.test(newText)))){
             newText = '';
             console.log("what a scrub");
             return 0;
         }else
         addPost(newId(), newTitle, newText, newAuthor);
         console.log("title: " + newTitle);
         console.log("called addPost!");
         
         
    }else{
        return 0;
        }
    
};


//Create Post Button (get post input --> call create/add post in MODEL)
document.querySelector("#modalsave").addEventListener('click', savePost);
document.querySelector("#modalsave").addEventListener('click', overlay);

//Close Modal Button
//document.querySelector("#modalclose").addEventListener('click',overlay);
//Open Modal Button
document.querySelector('#addPost').addEventListener('click', overlay);



// -------- calls

//renderPostList(postList);
//renderSinglePost(postTest);
//loadPostsFromDB();
//loadPostFromJSON({"author":"me", "content": "this is added on each refresh", "id":0,"title":"default post"});







