import {buildQuote} from '../../../../lib/quote-engine'
export async function POST(req){return Response.json({quote:buildQuote(await req.json())})}
