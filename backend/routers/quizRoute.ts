
import express from 'express';
import { Request , Response } from 'express';
import { pool } from '../config/db';
import { GetQuizByModuleId  , GetQusetions} from '../queries/quizQuery';
import { gptassist } from '../config/openai';

const router = express.Router();




const BASE = '/quiz'
router.get('/' , (req:Request , res : Response) =>{
   return res.status(200).json({
    statusCode : 200,
    msg :'workking ....'
   })
})


const prompt1 = 'make this questions a little harder along with options';
const prompt2 = 'too difficult , make these questions a bit easier along with options';
router.get('/:moduleID' , async (req : Request , res : Response) =>{
    const moduleID =  req.params.moduleID;
    const client  = await pool.connect();
    try{
        const response = await client.query(GetQuizByModuleId , [moduleID]);
        if(response){
         return res.status(200).json({
            data : response.rows
         })
        }
        else{
            return res.status(404).json({
                err :'cant find quiz for this sorry 😘'
            })
        }


    }
    catch(err){
        return res.status(500).json({
            err : 'Error'
        })
    }
    finally{
        client.release();
    }
})

router.post('/doubt' , async (req : Request , res : Response) =>{
    const {prompt} = req.body;
   // console.log(prompt);
    
    try{
    const result = await gptassist(prompt);
    if(result!=null){
      return res.status(200).json({
        statusCode : 200,
        ans : result
      })
    }
    else{
        return res.status(404).json({
            statusCode : 404,
            err :'404 not found'
        })
    }
}
catch(err){
    return res.status(500).json({
        err : "Internal Server Error"
    })
}
})


router.get('/results/:moduleID/:submoduleID/:score' , async ( req : Request , res : Response) =>{
    const client = await pool.connect();
    const {score}:any = req.params;
    const {moduleID} = req.params;
    const {submoduleID} = req.params;
    
    try{
        const response = await client.query(GetQusetions , [moduleID , submoduleID]);

    
        const prompt = JSON.stringify(response.rows);
        
        
        if(response){
             res.status(200).json({
                data : prompt
            })
        }
        
        if(prompt){
            
           
           if(score>=4){
            const result = await gptassist(prompt+prompt2);
            if(result!=null){
              
                return res.status(200).json({
                    statusCode : 200,
                    data : result
                })
                
            }
            else{
                return res.status(404).json(
                    {
                        statusCode : 500 , 
                        err : 'AI error'
                    }
                )
                
                
            }

           }
           else{
            const result = await gptassist(prompt+prompt1);
            if(result!=null){
                console.log(result);
                return res.status(200).json({
                    statusCode : 200,
                    data : result
                })
                
            }
            else{
                return res.status(404).json(
                    {
                        statusCode : 500 , 
                        err : 'AI error'
                    }
                )
                
                
            }

           }
            
            
        }
        
        
        
    }
    catch(err){
        return res.status(500).json({
            statusCode : 500,
            err : 'Internal Server Error'
        })
    }
    finally{
        client.release();
    }


})

const MODULE = {
    BASE , 
    router
}

export default MODULE;
