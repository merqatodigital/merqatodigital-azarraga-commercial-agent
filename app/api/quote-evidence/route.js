import {findEvidence} from '../../../lib/quote-engine'
export async function POST(req){const item=await req.json();return Response.json({evidence:findEvidence(item),rule:'Historical selling prices are evidence only and are never auto-applied to a new quotation.'})}
