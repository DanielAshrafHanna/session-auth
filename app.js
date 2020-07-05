const express = require ('express')
const bodyParser = require('body-parser')
const session = require ('express-session')
const cors = require('cors')
const { response } = require('express')

const TWO_HOURS = 1000*60*60*2

const {
    PORT = 3000,
    NODE_ENV = 'development',

    SESS_NAME = 'sid',
    SESS_SECRET =
    SESS_LIFETIME = TWO_HOURS
}   = process.env

const IN_PROD = NODE_ENV === 'production'

const users = [
    {id:"1",code:'123456789'}
]

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());

// app.use(express.json());
// app.use(bodyParser.json())
// app.use(express.urlencoded({ extended: false }));

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

app.post('/login' , redirectHome , (req, res) => {  
    const {code} = req.body
    
    if (code) {
        const user = user.find(
            user => user.code ==code
        )
        if (user) {
            req.session.code = user.code
            return response.redirect('/home')
        }
    }
        res.redirect('/login')
})


app.post('/register', redirectHome, (req, res) => {  // should take code from button that generates code
    const {code} = req.body
    console.log(req.body)
    console.log('sup77')

    app.post('/register', redirectHome, (req, res) => {  // should take code from button that generates code
        const {code} = req.body
        console.log(req.body)
        console.log('sup77')
    
        if (code){
          const exists = users.some(
            user => user.code === code
          )  
    
          if (!exist){                 // saving the user cookie 
              const user = {
                id: users.length +1,
                code
              }
              users.push(user)
    
              req.session.userId = user.id
    
              return res.redirect('/home')
    
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


app.listen(PORT, () => console.log (
    `http://localhost:${PORT}`
) )