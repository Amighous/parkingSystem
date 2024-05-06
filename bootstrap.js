import cors from 'cors'
import authRouter from './src/modules/auth/auth.routes.js'
import userRouter from './src/modules/user/user.routes.js'
import sensorRouter from './src/modules/sensor/sensor.routes.js'
 import { globalError } from './src/utils/errorHandling.js'


const bootstrap=(app,express)=>{
    var whitelist = ['http://example1.com', 'http://example2.com']
    if(process.env.MOOD == "DEV"){
        app.use(cors())
    }else{ 
        app.use(async (req, res, next) => {
        if(!whitelist.includes(req.header("origin"))){
            return next (new Error("Not allowed by CORS",{cause:502}))
        }
        await res.header('Access-Control-Allow-Origin',"*")
        await res.header('Access-Control-Allow-Header',"*")
        await res.header('Access-Control-Allow-Private-Network',"*")
        await res.header('Access-Control-Allow-Method',"*")
        next()
    })
    }
    // var corsOptions = {
    // origin: function (origin, callback) {
    //     if (whitelist.indexOf(origin) !== -1) {
    //     callback(null, true)
    //     } else {
    //     callback(new Error('Not allowed by CORS'))
    //     }
    // }
    // }

    app.use((req,res,next)=>{
        if(req.originalUrl=='/order/webhook'){
            return next();
        }else{
            express.json()(req,res,next)
        }
    })

    app.use('/user', userRouter)
    app.use('/auth', authRouter)
    app.use('/sensor' , sensorRouter)
    
    app.all('*', (req, res, next) => {
    res.send("In-valid Routing Plz check url or method")
    
    })
    app.use(globalError)
}


export default bootstrap