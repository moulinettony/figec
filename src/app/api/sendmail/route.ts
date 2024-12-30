import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { IncomingForm, File, Fields, Files } from "formidable";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import { IncomingMessage } from "http";
import os from "os";

const resend = new Resend("re_ZzqmygQX_BAdNvN2aJ13F8RNrTFufxYBM");

export const dynamic = "force-dynamic";

const streamToBuffer = async (
  stream: ReadableStream<Uint8Array>
): Promise<Buffer> => {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  let done, value;
  while ((({ done, value } = await reader.read()), !done)) {
    if (value) {
      chunks.push(value);
    }
  }

  return Buffer.concat(chunks);
};

const convertNextRequestToIncomingMessage = async (
  req: NextRequest
): Promise<IncomingMessage> => {
  const { headers, method, url } = req;
  const incomingMessage = new Readable() as IncomingMessage;

  incomingMessage._read = () => {};

  if (req.body) {
    const buffer = await streamToBuffer(req.body as ReadableStream<Uint8Array>);
    incomingMessage.push(buffer);
  }
  incomingMessage.push(null);

  incomingMessage.method = method || "GET";
  incomingMessage.url = url;
  incomingMessage.headers = Object.fromEntries(headers.entries());

  return incomingMessage;
};

const parseForm = async (
  req: NextRequest
): Promise<{ fields: Fields; files: Files }> => {
  const incomingMessage = await convertNextRequestToIncomingMessage(req);
  const uploadDir = path.join(os.tmpdir(), "uploads");

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

const getFieldValue = (field: string | string[] | undefined): string => {
  if (Array.isArray(field)) {
    return field[0] || "";
  }
  return field || "";
};

export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseForm(req);

    const firstName = getFieldValue(fields.firstName);
    const lastName = getFieldValue(fields.lastName);
    const adresse = getFieldValue(fields.adresse);
    const ville = getFieldValue(fields.ville);
    const codePostal = getFieldValue(fields.codePostal);
    const email = getFieldValue(fields.email);
    const telephone = getFieldValue(fields.telephone);
    const anneesExperiences = getFieldValue(fields.anneesExperiences);
    const domaineExpertise = getFieldValue(fields.domaineExpertise);
    const posteDesire = getFieldValue(fields.posteDesire);
    const message = getFieldValue(fields.message);

    const file = files.file
      ? Array.isArray(files.file)
        ? files.file[0]
        : files.file
      : null;

    let attachments = [];
    if (file) {
      const filePath = (file as File).filepath;
      const fileData = fs.readFileSync(filePath);
      const base64File = fileData.toString("base64");
      attachments.push({
        filename: (file as File).originalFilename || "",
        content: base64File,
        encoding: "base64",
      });
    }

    const emailResponse = await resend.emails.send({
      from: "Candidature@figecmaroc.com",
      cc: ["Achaimaa.berrak@figec-maroc.net"],
      bcc: ["amine@dopweb.com"],
      to: ["Karim.bennouna@figec-maroc.net"],
      subject: "Nouvelle Candidature",
      html: `
        <p>First Name: <strong>${firstName}</strong></p>
        <p>Last Name: <strong>${lastName}</strong></p>
        <p>Adresse: <strong>${adresse}</strong></p>
        <p>Ville: <strong>${ville}</strong></p>
        <p>Code Postal: <strong>${codePostal}</strong></p>
        <p>Email: <strong>${email}</strong></p>
        <p>Téléphone: <strong>${telephone}</strong></p>
        <p>Années d'expériences: <strong>${anneesExperiences}</strong></p>
        <p>Domaine d'expertise: <strong>${domaineExpertise}</strong></p>
        <p>Poste désiré: <strong>${posteDesire}</strong></p>
        <p>Message: <strong>${message}</strong></p>
      `,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    return NextResponse.json({ success: true, response: emailResponse });
  } catch (error) {
    console.error("Error sending email:", error);

    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ success: false, error: errorMessage });
  }
}
