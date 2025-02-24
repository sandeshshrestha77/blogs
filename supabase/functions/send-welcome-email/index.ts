
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    const { email } = await req.json()

    const emailResponse = await resend.emails.send({
      from: 'Insights Weekly <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to Insights Weekly!',
      html: `
        <h1>Welcome to Insights Weekly!</h1>
        <p>Thank you for subscribing to our newsletter. You'll receive weekly insights about design, technology, and business.</p>
        <p>Best regards,<br>The Insights Team</p>
      `,
    })

    console.log('Email sent successfully:', emailResponse)

    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in send-welcome-email function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
