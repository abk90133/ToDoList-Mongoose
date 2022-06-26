//jshint esversion:6

const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");


let items = [];
//here we have declared it above because at down it was showing error to it. and here it will store the values
let workItems = [];


const app = express();

app.set('view engine', 'ejs');


app.use(express.static("public"));
//this has to mentioned because

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://admin-abhishek:Test123@cluster0.hofq5.mongodb.net/todolistDB");
//used to connect to the mongoose server
//and this will create a DB for use in mongoose server that will store our data

const itemsSchema = {
  name: "String"
};

const Item = mongoose.model("Item", itemsSchema);
//here we have declared the Item schema of mongoose

const Grocery = new Item ({
  name: "Milk"
});

const Walk = new Item ({
  name: "Exercise"
});

const Sleep = new Item ({
  name: "Pillow"
});

const defaultItems = [Grocery, Walk, Sleep];
//we have stored this into an array so that we can all 3 at one go


//THIS LIST SCHEMA IS FRESHLY CREATED TO STORE THE VALUE OF THE NEW SEARCH BAR AFTER LOCALHOST:3000/SEARCHBAR
//WHICH WILL BE USED AT THE app.get("/:customListName", function(req, res){

const listSchema = {
  name: String,
  items: [itemsSchema]
  //[itemSchema] will store the value of arrays based on the itemSchema
  //because we have already declared the itemsSchema upwards
};

//this Listschema is used to created so that it can store the value of the PAGE when called for localhost:3000/whatever
//so anything will be in the page of "whatever" will be created here

const List = mongoose.model("List", listSchema);

//BELOW USED THE MONGOOSE.INSERTMANY() AS MENTIONED IN NOTEBOOK

// Item.insertMany(defaultItems, function(err){
//   if(err) {
//     console.log(err);
//   } else{
//     console.log("Success");
//   }
// });

//COMMENTED THE ABOVE CODE OUT BECAUSE IF WE RUN IT AGAIN AND AGAIN SO IT WILL KEEP STORING THE VALUE INTO IT

//after doing all the above code we will get this saved in to db.items.find() in the mongo server but is not shown at the webpage for now

app.get("/", function(req, res){



  // if (currentDay === 6 || currentDay === 0) {
  //   day = "Weekend";
  // } else {
  //   day = "Weekday";
  // }

  //Now to run for Each day we have to use the switch case

  // switch(currentDay) {
  //   case 0:
  //     day = "Sunday";
  //     break;
  //   case 1:
  //     day = "Monday";
  //     break;
  //   case 2:
  //     day = "Tuesday";
  //     break;
  //   case 3:
  //     day = "Wednesday";
  //     break;
  //   case 4:
  //         day = "Thursday";
  //         break;
  //       case 5:
  //           day = "Friday";
  //           break;
  //           case 6:
  //             day = "Saturday";
  //             break;
  //             default:
  //             console.log(error);

  // }

  // let day = date();
  //IT MEANS THAT THE "let day" will store the Value of the function "()" that is stored in the constant date that was defined above to us.

  //This will check if the Item array is empty or not in Item schema, if empty it will put the value of defaultItems into it
  Item.find({}, function(err,  foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err) {
          console.log(err);
        } else{
          console.log("Success");
        }
      });
      res.redirect("/");
      //it will after saving, will redirect it to the HOMEROUTE
    } else{
          res.render("list", { listTitle: "Today", newListItems: foundItems });
          //redirecting to the list.ejs and updating the values
      }
  });

  //as here we are using the newListItems in the EJS module so it will be pushing the value to the list.ejs module

  //we have removed the date with the "Today"
  //by this we are passing the value of listTitle to day in our "list".ejs file
  //by this we are passing the value of kindOfDay to day in our "list".ejs file
  //it actually helped us to not create a very new file for each and every day.

});

app.post("/", function(req, res) {
  let itemName= req.body.value;
  let workItem = req.body.value;
  const listName = req.body.list;

  //this is basically pushing the item into the items array.
  //and always never forget to declare the letiables into the files


  //now if we push it like this then it will be added to next to it instread on the next line, to overcome this we have to use the for loop.


  //we have used this because we cannot use the res.render outside the app.get() so to push the value outside it we use this.

  // console.log(item);

  //NOW THE BELOW CODE IS FOR THAT BECAUSE WHEN WE CLICK ON THE SUBMIT BUTTON IT WILL PUT THE ENTRY TO THE HOMEROUTE ITSELF.
  const item = new Item ({
    name: itemName
  });

  if (listName === "Today") {  //listName should be declared above into this)
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
      //what it is doing is, when a user post a entry, then it will check whether it is in the "Today" list or somewhere else,
      //if it is somewhere else then it will update the data into this list and then it will save
    });
  }
});

app.get("/:customListName", function(req, res){
  const customListName = req.params.customListName;
//used when we get any get request or search request for a customList from the search BAR


  List.findOne({name: customListName}, function(err, foundList){ //2.A
    if(!err){
      if(!foundList){
        //Create a List
        const list = new List({
          //the values we put in it is already defined in the List listSchema
          name: customListName,
          items: defaultItems
          //above values will be entered to a new page
        });
      list.save();
      res.redirect("/" + customListName);
    } else {
      //Show a existing List
      res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      //it will be sent to the list.ejs file to populated the output of it, after searching it through the foundList items in above 2.A
    }
  }
  });
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  //this is storing the ID of the particular item which is checked
  const listName = req.body.listName;
  //added because of the last lecture

  //used to delete the particular checked

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(err){
        console.log(err);
      } else {
        console.log("Successfully deleted!");
        res.redirect("/");
      }
    });
  } else {
    //here the complexity starts because of have to search for the items into the array inside the mongoose because that is the one storing the data
    //into it

    //search for mongoose remove document from array
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      //it is saying, check from the Listname and pull from the Items array in the listSchema which has a ID placed in _id
      if(!err){
        res.redirect("/" + listName);
        //it is basically deleting the particluar entry in the particular listName, it is searching through the array which is present as items: [itemsSchema]
        // check for 10A in list.ejs
      }
    });

  }

});

app.get("/work", function(req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems});
});

app.listen(3000, function(){
  console.log("Port is running on 3000");
});


//WITH LOVE, CODE IS COMPLETED
