const express = require("express");
let app = express();
let port = 8080;
let path = require("path");
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const mysql = require("mysql2");
const { error } = require("console");

app.use(methodOverride('_method'));


app.set("view engine" , "ejs");
app.set(path.join(__dirname , "views"));

app.use(express.static(path.join(__dirname , "public" )));
app.use(express.urlencoded({extended :true}));

app.listen(port , ()=>{
    console.log(`App is Listening on port ${port}`);
})

app.get("/home" , (req , res)=>{
    res.render("home.ejs");
})

app.get("/page1" , (req , res)=>{
    res.render("page1.ejs")
})

app.get("/page2" , (req , res)=>{
    res.render("page2.ejs")
})

app.get("/page3" , (req , res)=>{
    res.render("page3.ejs")
})

app.get("/page4" , (req , res)=>{
    res.render("page4.ejs")
})

app.get("/page5" , (req , res)=>{
    res.render("page5.ejs")
})

app.get("/page6" , (req , res)=>{
    res.render("page6.ejs")
})

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "receipe",
    password: "SafShu@12345",
  });

// Add New Records.
app.post("/user/new" , (req , res)=>{
    let { name, email, password, confirmpassword } = req.body;
    let id = uuidv4();
    let q = `INSERT INTO user (id, name, email, password , confirmpassword) VALUES ('${id}','${name}','${email}','${password}', '${confirmpassword}') `;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        console.log("added new user");
        res.render("sucess.ejs")
      });
    } catch (err) {
      res.send("some error occurred");
    }
    
})
// Show ALL Records.
app.get("/user" ,(req , res)=>{
    try {
        let q = `SELECT * FROM user`;
        connection.query(q, (error, result) => {
          if (error) throw error;
          res.render("show.ejs", { result });
          console.log(result);
        });
      } catch (error) {
        console.log(error);
        res.send("Something wrong with the database");
      }
})

// Edit
app.get("/user/edit/:id", (req, res) => {
    try {
      let { id } = req.params;
      let q = `SELECT * FROM user WHERE id = ?`;
      connection.query(q, [id], (error, result) => {
        if (error) throw error;
        let user = result[0];
        console.log(result);
        res.render("edit.ejs" , {user});
        
  
      });
    } catch (error) {
      res.send("Something went Wrong")
    }
  });
  app.patch("/user/:id" , (req ,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = ?`;
    let { password: formpass, dishname: newdish, content: newContent } = req.body;
    try{
      connection.query(q , [id], (error , result)=>{
        if(error) throw error;
        let user = result[0];
        if(formpass != user.password){
          res.send("Wrong password");
        }else{
            let q2 = `UPDATE user SET dishname = ?, content = ? WHERE id = ?`;
          connection.query(q2 ,[newdish , newContent , id] ,(error , result)=>{
            if(error) throw error
            res.redirect("/user");
          })
        }
  
      })
  
    }catch(error){
      console.log(error);
      res.send("Something went wrong with the database");
    }
  })

// Delete
  app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
        res.render("delete.ejs", { user });
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });
  app.delete("/user/:id/", (req, res) => {
    let { id } = req.params;
    let { password } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
  
        if (user.password != password) {
          res.send("WRONG Password entered!");
        } else {
          let q2 = `DELETE FROM user WHERE id='${id}'`; 
          connection.query(q2, (err, result) => {
            if (err) throw err;
            else {
              console.log(result);
              console.log("deleted!");
              res.redirect("/user");
            }
          });
        }
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });

app.post("/logins", (req , res)=>{
  try{
    let {email, password} = req.body;
    let q = `SELECT *  FROM USER WHERE email = ?`;
    connection.query(q , [email], (error , result)=>{
      let user = result[0];
      if(password!== user.password){
        res.send("You entered a wrong password");
      }else{
        res.render("edit.ejs" , {user})
      }
    })
  }catch(error){
    console.log(error)
    res.send("Something went wrong");
  }
})
