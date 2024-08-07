import OpenAI, { toFile } from "openai";
import path from "path";
import { writeFile } from "fs/promises";
import { v4 as uuid } from "uuid";
import { NextResponse } from "next/server";

const fs = require("fs");

{/*export const config = {
  api: {
    bodyParser: false,
  },
};*/}

export async function POST(req: any) {
  /*const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });*/
  const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY}); 
  const file = (await req.formData()).get('file') as File;
  //const modifiedFile = new File([file], 'file45344' , { type: 'mpeg' });
  const buffer = Buffer.from(await file.arrayBuffer());
  const fName= uuid()+'.mp3';
  const modifiedFile = await toFile(buffer,fName,{type:'mp3'});
  {/*const fileName='/public/'+uuid()+'.mp3';
  const currentDir = process.cwd();
  // console.log('CURRENT DIRECTORY JE: ', currentDir);
  const filePath = path.join(currentDir,fileName);
  // console.log("FILE PATH JE: ", filePath);
  try {
   const writeFi = await writeFile(
      fileName,
      buffer
    );
    // console.log("FI jE: ",writeFi);
  } catch (error) {
    // console.log("Error occured (WRITING FILE) ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }*/}


  try {
    const resp = await openai.audio.transcriptions.create(
      {file:modifiedFile,
      model:"whisper-1"}
      // Uncomment the line below if you would also like to capture filler words:
      // "Please include any filler words such as 'um', 'uh', 'er', or other disfluencies in the transcription. Make sure to also capitalize and punctuate properly."
    );

    const transcript = resp?.text;
    

    // Content moderation check
    const response = await openai.moderations.create({
      input: resp?.text,
    });

    if (response?.results[0]?.flagged) {
      NextResponse
        .json({ error: "Inappropriate content detected. Please try again." },{status:400});
      return;
    }
    // console.log("Tekst ",resp.text);
    NextResponse.json({ transcript });
    return NextResponse.json(resp.text);
  } catch (error) {
    console.error("server error", error);
    throw new Error("Server error"); 
  }
}
