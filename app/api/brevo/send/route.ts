import { NextRequest, NextResponse } from "next/server";
const brevo = require('@getbrevo/brevo');

export async function POST(req: NextRequest) {
    try {
        const { userEmail, chessUser } = await req.json();
        console.log("User Email: ", userEmail);
        console.log("chessUser: ", chessUser);
        
        if (!userEmail || typeof (userEmail) !== 'string') {
            return NextResponse.json({ message: "No receiver email address provided" }, { status: 400 });
        }
        if (!chessUser || typeof (chessUser) !== 'string') {
            return NextResponse.json({ message: "No user chess name provided" }, { status: 400 });
        }

        const apiInstance = new brevo.TransactionalEmailsApi();

        const apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = process.env.BREVO_API_KEY;
        console.log("API KEYyy: ", process.env.BREVO_API_KEY);
        
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.templateId = 82;
        sendSmtpEmail.subject = "Welcome to ChessyAI";
        sendSmtpEmail.htmlContent = "<html><body><h1>Common: This is my first transactional email {{params.parameter}}</h1></body></html>";
        sendSmtpEmail.sender = { "name": "Chessvia", "email": "admin@chessvia.com" };
        sendSmtpEmail.to = [
            { "email": userEmail, "name": chessUser }
        ];
        sendSmtpEmail.replyTo = { "email": "gabe@chessvia.com", "name": "ChessyAI Admin" };
        sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
        sendSmtpEmail.params = { "parameter": "My param value", "name": chessUser, "subject": "Welcome to ChessyAI" };

        try {
            const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
            return NextResponse.json({ status: 200, data });
        } catch (error) {
            console.error("Error sending email:", error);
            return NextResponse.json({ status: 500, error: "Error sending email" });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ status: 500, error: "Error processing request" });
    }
}