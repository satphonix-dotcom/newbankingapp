
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendSMSRequest {
  phone: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, message }: SendSMSRequest = await req.json();

    // Basic validation
    if (!phone || !message) {
      throw new Error('Phone number and message are required');
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing Twilio credentials');
    }

    // Log the request (without sensitive data)
    console.log('Sending SMS to:', phone);

    // Make request to Twilio API
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        },
        body: new URLSearchParams({
          To: phone,
          From: fromNumber,
          Body: message,
        }),
      }
    );

    const twilioData = await twilioResponse.json();

    // Log the response (without sensitive data)
    console.log('Twilio response status:', twilioResponse.status);

    if (!twilioResponse.ok) {
      throw new Error(`Twilio error: ${JSON.stringify(twilioData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, messageId: twilioData.sid }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-sms function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};

serve(handler);
