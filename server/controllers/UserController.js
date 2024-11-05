import {Webhook} from 'svix'
import usersModel from '../models/usersModel.js'

//Api controller function to manage Clerk user with database
//creating the web hooks api
//http://localhost:4000/api/user/webhooks

const clerkWebHooks = async (req,res) =>{
    
    try {
        //creating the svix instance with clerk webhook 
        const whook =  new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body),{
            'svix-id' : req.headers['svix-id'],
            'svix-timestamp' : req.headers['svix-timestamp'],
            'svix-signature' : req.headers['svix-signature']
        })

        const {data, type} = req.body

        switch (type) {
            case "user.created":{
//logic for adding user to database
                const userData ={
                    clerkId: data.id,
                    email: data.email_addresses[0].email_addresses,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }
                await usersModel.create(userData)
                res.json({})
                break;

            }
            case "user.updated":{
                
                const userData ={
                    
                    email: data.email_addresses[0].email_addresses,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                await usersModel.findOneAndUpdate({clerkId : data.id}, userData)
                res.json({})
                break;

            }

            case "user.deleted":{
                
                await usersModel.findOneAndDelete({clerkId:data.id})
                res.json({})
                break;

            }
        
            default:
                break;
        }
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }
}  

export {clerkWebHooks}