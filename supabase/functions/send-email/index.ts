import { SESClient, SendEmailCommand } from "npm:@aws-sdk/client-ses";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, topic, message } = await req.json();

    const sesClient = new SESClient({ 
        region: Deno.env.get("AWS_REGION") || "us-east-1",
        credentials: {
            accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID") || "",
            secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY") || ""
        }
    });

    const command = new SendEmailCommand({
        Source: "dummy0testing@gmail.com", 
        Destination: {
            ToAddresses: ["dummy0testing@gmail.com"], 
        },
        ReplyToAddresses: [email],
        Message: {
            Subject: {
                Charset: "UTF-8",
                Data: `New Contact Form: ${topic}`,
            },
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: `You received a new message from: ${email}\n\n${message}`,
                },
            },
        },
    });

    await sesClient.send(command);

    return new Response(
      JSON.stringify({ success: "Email sent successfully!" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("AWS SES Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});