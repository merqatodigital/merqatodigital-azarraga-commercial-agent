import {NextResponse} from 'next/server'

const PASSKEY = process.env.PASSKEY || ''

export async function POST(req){
  if(!PASSKEY) return NextResponse.json({error:'PASSKEY not configured'},{status:500})
  let passkey = ''
  try{
    const body = await req.json()
    passkey = body?.passkey ?
      String(body.passkey).trim() :
      ''
  }catch(e){
    const {searchParams} = new URL(req.url)
    passkey = String(searchParams.get('passkey') || '').trim()
  }
  if(!passkey || passkey !== PASSKEY) return NextResponse.json({error:'Invalid passkey'},{status:401})

  const response = NextResponse.json({authenticated:true})
  response.cookies.set('azarraga_session','verified',{
    httpOnly:true,
    secure:process.env.NODE_ENV==='production',
    sameSite:'lax',
    path:'/',
    maxAge:60*60*24*7
  })
  return response
}

export async function GET(req){
  const {searchParams} = new URL(req.url)
  const passkey = String(searchParams.get('passkey') || '').trim()
  if(!PASSKEY) return NextResponse.json({error:'PASSKEY not configured'},{status:500})
  if(passkey !== PASSKEY) return NextResponse.json({error:'Invalid passkey'},{status:401})
  const response = NextResponse.json({authenticated:true})
  response.cookies.set('azarraga_session','verified',{
    httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*24*7
  })
  return response
}