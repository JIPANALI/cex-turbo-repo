import { BASE_CURRENCY } from "./Engine";


export interface Order{
    price:number;
    quantity:number;
    orderId:string;
    filled:number;
    side:"buy" | "sell";
    userId:string
}

export interface Fill{
    price :string;
    qty:number;
    tradeId:number;
    otherUserId:string;
    marketOrderId:string
}

export class Orderbook{
    bids:Order[];
    asks:Order[];
    baseAsset:string;
    quoteAsset:string=BASE_CURRENCY;
    lastTradeId:number;
    currentPrice:number;


    constructor(baseAsset:string,bids:Order[],asks:Order[],lastTradeId:number,currentPrice:number){
        this.bids=bids;
        this.asks=asks;
        this.baseAsset=baseAsset;
        this.lastTradeId=lastTradeId || 0;
        this.currentPrice=currentPrice || 0;

    }

    ticker(){
        return `${this.baseAsset}_${this.quoteAsset}`
    }

    getSnapshot(){
        return {
           baseAsset:this.baseAsset,
           bids:this.bids,
           asks:this.asks,
           lastTradeId:this.lastTradeId,
           currentPrice:this.currentPrice
        }
    }



    addOrder(order:Order){
        execcutedQty:number,
        fills:Fill[]
    }{
        if(order.side=="buy"){
            const {excutedQty,fills}=this.mathchBid(order)
        }
    }

    matchBid(order:Order):{fills:Fill[],executedQty:number}{
        const fills:Fill[]=[];
        let executedQty=0;

        // if some one want to buy then this will be here match with the seller(asks).
        for(let i=0;i<this.asks.length;i++){
            if(this.asks[i].price<=Orderbook.price && executedQty<order.quantity){
                const filledQty=Math.min((order.quantity-executedQty),this.asks[i].quantity);
                executedQty+=filledQty;
                this.asks[i].filled+=filledQty;//who are the seller in that seller push that how much filled means sold of your stock
                fills.push({
                    price:this.asks[i].price.toString(),
                    qty:filledQty,
                    tradeId:this.lastTradeId++,
                    otherUserId:this.asks[i].userId,
                    marketOrderId:this.asks[i].orderId

                })
            }
        }

        for(let i=0; i<this.asks.length;i++){

            //if the seller filled means(sold) and how much wanted sell(quantity) matches then we will removed from the ask
            if(this.asks[i].filled===this.asks[i].quantity){
                this.asks.splice(i,1);
                i--;
            }
        }


    }
}