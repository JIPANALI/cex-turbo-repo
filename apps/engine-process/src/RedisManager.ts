import { RedisClientType,createClient } from "redis";
import { DBMessageTypes } from "./types";
import { ToWsMessageTypes } from "./types/toWsTypes";
import { ToApiMessageTypes } from "./types/toApiTypes";


export class RedisManager{
 private client:RedisClientType;
 private static instance:RedisManager;


 private constructor(){
    this.client=createClient();
    this.client.connect()
 }

 public static getInstance(){
    if(!this.instance){
       return this.instance=new RedisManager();
    }
    return this.instance;

 }

 public pushMessageForDbProcessor(message:DBMessageTypes){
        this.client.lPush("db_processor",JSON.stringify(message))
 }

 public publishToWs(channel:string,message:ToWsMessageTypes){
    this.client.publish(channel,JSON.stringify(message))
 }

 public publishToApi(clientId:string,message:ToApiMessageTypes){
    this.client.publish(clientId,JSON.stringify(message))
 }

}


