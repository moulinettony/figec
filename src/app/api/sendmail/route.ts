import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { IncomingForm, File, Fields, Files } from 'formidable';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { IncomingMessage } from 'http';

const resend = new Resend('re_9ET6YxZ9_7pDf8FrDpdj6VE2SJmGDdUmA');

export const config = {
  api: {
    bodyParser: false,
  },
};

const streamToBuffer = async (stream: ReadableStream<Uint8Array>): Promise<Buffer> => {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  let done, value;
  while ({ done, value } = await reader.read(), !done) {
    if (value) {
      chunks.push(value);
    }
  }

  return Buffer.concat(chunks);
};

const convertNextRequestToIncomingMessage = async (req: NextRequest): Promise<IncomingMessage> => {
  const { headers, method, url } = req;
  const incomingMessage = new Readable() as IncomingMessage;

  incomingMessage._read = () => {};
  
  if (req.body) {
    const buffer = await streamToBuffer(req.body as ReadableStream<Uint8Array>);
    incomingMessage.push(buffer);
  }
  incomingMessage.push(null);

  incomingMessage.method = method || 'GET';
  incomingMessage.url = url;
  incomingMessage.headers = Object.fromEntries(headers.entries());

  return incomingMessage;
};

const parseForm = async (req: NextRequest): Promise<{ fields: Fields; files: Files }> => {
  const incomingMessage = await convertNextRequestToIncomingMessage(req);
  const uploadDir = path.join(process.cwd(), 'uploads');

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(incomingMessage, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseForm(req);

    const getFieldValue = (field: string | string[] | undefined): string => {
      if (Array.isArray(field)) {
        return field[0] || '';
      }
      return field || '';
    };

    const firstName = getFieldValue(fields.firstName as string | string[]);
    const lastName = getFieldValue(fields.lastName as string | string[]);
    const adresse = getFieldValue(fields.adresse as string | string[]);
    const ville = getFieldValue(fields.ville as string | string[]);
    const codePostal = getFieldValue(fields.codePostal as string | string[]);
    const email = getFieldValue(fields.email as string | string[]);
    const telephone = getFieldValue(fields.telephone as string | string[]);
    const anneesExperiences = getFieldValue(fields.anneesExperiences as string | string[]);
    const domaineExpertise = getFieldValue(fields.domaineExpertise as string | string[]);
    const posteDesire = getFieldValue(fields.posteDesire as string | string[]);
    const message = getFieldValue(fields.message as string | string[]);

    const file = files.file ? (Array.isArray(files.file) ? files.file[0] : files.file) : null;

    let attachments = [];
    if (file) {
      const filePath = (file as File).filepath;
      const fileData = fs.readFileSync(filePath);
      const base64File = fileData.toString('base64');
      attachments.push({
        filename: (file as File).originalFilename || '',
        content: base64File,
        encoding: 'base64',
      });
    }

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'amine@dopweb.com',
      subject: 'New Submission',
      html: `
        <p>First Name: <strong>${firstName}</strong></p>
        <p>Last Name: <strong>${lastName}</strong></p>
        <p>Adresse: <strong>${adresse}</strong></p>
        <p>Ville: <strong>${ville}</strong></p>
        <p>Code Postal: <strong>${codePostal}</strong></p>
        <p>Email: <strong>${email}</strong></p>
        <p>Téléphone: <strong>${telephone}</strong></p>
        <p>Années d’expériences: <strong>${anneesExperiences}</strong></p>
        <p>Domaine d’expertise: <strong>${domaineExpertise}</strong></p>
        <p>Poste désiré: <strong>${posteDesire}</strong></p>
        <p>Message: <strong>${message}</strong></p>
      `,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('Error sending email:', error);

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ success: false, error: errorMessage });
  }
}