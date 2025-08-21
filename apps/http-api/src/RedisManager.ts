import {RedisClientType,createClient}   from "redis"
import { MessageToEngineTypes } from "./types/toOut";
import {MessageFromOrderBookTypes} from "./types/index"

export class RedisManager{
    private client:RedisClientType; //one for subscriber 
    private publisher:RedisClientType;//other one for publisher
    private static instance:RedisManager; //here initialized the instance itself type

    //here private constructor so it cant create the object outsid eof this class
    private constructor(){
        this.client=createClient();
        this.client.connect();

        this.publisher=createClient();
        this.publisher.connect()
    }


    //creating the instance //if already instance is created then we will not creating again the instance
    public static getInstance(){
        if(!this.instance){
            this.instance=new RedisManager()
        }
        return this.instance;
    }

    public generateRandomClientId(){
        return Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);
    }



    //this is for the taking from the api and send to engine using lpush and before that also subscribe with pubsub also(subscribe untill engine will publish)
    public sendToEngineAndWait(message:MessageToEngineTypes){
        return new Promise<MessageFromOrderBookTypes>((resolve)=>{
            const Id=this.generateRandomClientId();

            //For the take from the api and first subscribe to to pubsub(client )
            this.client.subscribe(Id,(message)=>{
                //when get the result from teh pubsub then we will subscribe
                this.client.unsubscribe(Id);

                //just in resolve here we will do only parse massage to json and which will send to browser
                resolve(JSON.parse(message))
            })

            //this is queue(Message Queue) after subscribe here we push teh event which engine have to excute taking from here
            this.publisher.lPush(Id,JSON.stringify({clientId:Id,message}))
        })
    }
}
