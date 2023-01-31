const express=require("express");
const body_parser=require("body-parser");
const mongoose=require("mongoose");
const date=require(__dirname+"/date.js");
const app=express();


app.use(body_parser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1/todolistdb",{useNewUrlParser:true});
    

const ItemSchema=new mongoose.Schema({
    task:{
        type:String,
        required:true
    }
}  
)

const Item=mongoose.model('Item',ItemSchema);

const item1=new Item({
    task:"welcome to the todo list"
})
const item2=new Item({
    task:"hit + to add new item"
})
const item3=new Item({
    task:"<-- check this to delete the item"
})

const defaultItems=[item1,item2,item3];

// Item.insertMany(defaultItems,(err)=>{
//     if(err){
//         console.log("error in inserting");
//     }
//     else console.log("inserted the items");
// })


app.get("/",(req,res)=>{
    let day=date.getDate();
    if(Item.find(function(err,founditems){
            if(founditems.length==0){
                Item.insertMany(defaultItems,(err)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                    console.log("default items have been inserted");
                    }
                })
            }
            else
            {
                res.render("list",{theDay:day,newlistitem:founditems})
            }
           
        }));
});


app.post("/",(req,res)=>{
    item=req.body.newItem;

    if(item==""){
     res.redirect("/");
    }
    else{

    let itemnew=new Item({
        task:item
    })
    itemnew.save();
    res.redirect("/");
    }   
})

app.listen(3000,()=>{
    console.log("server has started at port 3000");
});
