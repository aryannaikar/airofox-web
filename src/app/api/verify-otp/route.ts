import { NextResponse } from 'next/server';
import crypto from 'crypto';

const SECRET = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'airofox-secret-otp-salt-key';

export async function POST(request: Request) {
  try {
    const { email, otp, token } = await request.json();

    if (!email || !otp || !token) {
      return NextResponse.json({ success: false, error: 'Email, OTP code, and validation token are required.' }, { status: 400 });
    }

    // Re-verify the hash locally
    const expectedToken = crypto.createHmac('sha256', SECRET).update(`${email.toLowerCase()}:${otp}`).digest('hex');

    if (token === expectedToken) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Incorrect verification code. Please try again.' });
    }
  } catch (error: any) {
    console.error('Verify OTP API error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
