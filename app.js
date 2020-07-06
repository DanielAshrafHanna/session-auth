const express = require ('express')
const bodyParser = require('body-parser')
const session = require ('express-session')
const cors = require('cors')
const { response } = require('express')
const path = require ('path')   //3 

const TWO_HOURS = 1000*60*60*2

const {
    PORT = process.env.PORT || 3000,  //1
    NODE_ENV = 'development',

    SESS_NAME = 'sid',
    SESS_SECRET ='a./sdsd/.gfgf' ,
    SESS_LIFETIME = TWO_HOURS
}   = process.env

const IN_PROD = NODE_ENV === 'production'

const users = [
    {id:"1",code:"123456"}
]

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false ,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite : true,
        secure: IN_PROD
    }
}))

const redirectLogin = (req, res ,next) => {  // if user is not authenticated redirect to login
    if (!req.session.code){
        res.redirect('/login')
    } else {
        next()
    }
}

const redirectHome = (req, res ,next) => {  // go to buttons page
    if (req.session.userID){
        res.redirect('/home')
    } else {
        next()
    }
}

   
app.get('/' , (req, res) => {
    console.log(req.session)
    console.log('sup5551')

    res.send(
        
        '<h1>hello</h1>'
    )

   

}) 
    

app.get('/home' , redirectLogin, (req, res) => { //  buttons page   chech if user is uthanticated. if not redirect to login 
    
})

app.get('/login' , redirectHome , (req, res) => {  // link with code text area      will take the code to redirect to game 
    
    

})

app.get('/register' , redirectHome , (req, res) => {  // link with random number button

})

app.post('/login' , redirectHome , (req, res) => {   // reciving data from text field 
    const {code} = req.body
    console.log(code)
    console.log(req.body)   //test to see incoming from react 
    
    if (code) {
        const user = users.find(
            user => user.code ===code
        
        )
        if (user) {
            req.session.userId = user.id   // check this again
           // return response.redirect('/home')
           return res.status(200).json("you are in ")
        }
    }
    //    res.redirect('/login')
   // res.status(200).json("please create code")
})

app.post('/register', redirectHome, (req, res) => {  // reciveing code from fenerate code button
   const {random} = req.body
    console.log(random)
    console.log(req.body)   // test to see incoming from react
   // console.log('sup77')

    if (random){
      const exists = users.some(
        user => user.code === random
      )  

      if (!exists){                 // saving the user cookie 
        var randomString = random.toString();
          const user = {
            id: users.length +1,
            code : randomString 
          }
          users.push(user)
          console.log(users)   // test

          req.session.userId = user.id

         // return res.redirect('/home')
        return res.status(200).json("created")

      }
    }
    res.status(200).json({data: 'Okay'})
})

app.post('/logout' ,redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home')
        }
        res.clearCookie(SESS_NAME)
        res.redirect('/login')

    })

})

//3
if (process.env.NODE_ENV === 'production') {
    app.use(express.static( 'win-as-much-as-you-can/build' ));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'win-as-much-as-you-can', 'build', 'index.html')); // relative path
    });
}



app.listen(PORT, () => console.log (
    `http://localhost:${PORT}`
) )