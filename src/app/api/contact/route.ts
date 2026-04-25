import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  needs?: unknown;
  website?: unknown;
  lang?: unknown;
};

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 160;
const MAX_NEEDS_LENGTH = 2000;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function extractEmailAddress(value: string) {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] ?? value).trim();
}

function isValidConfiguredEmail(value: string | undefined) {
  return Boolean(value && isValidEmail(extractEmailAddress(value)));
}

function parseRecipientList(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeText(value: string) {
  return value.trim().replace(/\r\n/g, "\n");
}

function normalizeErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return "Unable to process the contact request.";
}

function buildEmailMarkup({
  name,
  email,
  needs,
  lang,
}: {
  name: string;
  email: string;
  needs: string;
  lang: "en" | "id";
}) {
  const safeNeeds = escapeHtml(needs).replaceAll("\n", "<br />");

  return {
    subject:
      lang === "id"
        ? `Inquiry baru dari ${name} via bornworks.id`
        : `New inquiry from ${name} via bornworks.id`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <h2 style="margin-bottom:16px">New Project Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Language:</strong> ${lang}</p>
        <p><strong>Project Brief:</strong></p>
        <p>${safeNeeds}</p>
      </div>
    `,
    text: [
      "New Project Inquiry",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Language: ${lang}`,
      "",
      "Project Brief:",
      needs,
    ].join("\n"),
  };
}

function createTransporter() {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || "465");
  const smtpSecure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : smtpPort === 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

async function sendViaSmtp({
  to,
  from,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string[];
  from: string;
  subject: string;
  html: string;
  text: string;
  replyTo: string;
}) {
  const transporter = createTransporter();

  if (!transporter) {
    throw new Error("SMTP is not configured. Please set SMTP_USER and SMTP_PASS.");
  }

  await transporter.sendMail({
    from,
    to: to.join(", "),
    subject,
    html,
    text,
    replyTo,
  });
}

async function sendViaWebhook({
  webhookUrl,
  payload,
}: {
  webhookUrl: string;
  payload: Record<string, string>;
}) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Webhook delivery failed: ${errorText}`);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    if (typeof body.website === "string" && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    if (!isNonEmptyString(body.name) || body.name.trim().length > MAX_NAME_LENGTH) {
      return NextResponse.json({ ok: false, message: "Invalid name." }, { status: 400 });
    }

    if (!isNonEmptyString(body.email) || body.email.trim().length > MAX_EMAIL_LENGTH) {
      return NextResponse.json({ ok: false, message: "Invalid email." }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, message: "Invalid email." }, { status: 400 });
    }

    if (!isNonEmptyString(body.needs) || body.needs.trim().length > MAX_NEEDS_LENGTH) {
      return NextResponse.json({ ok: false, message: "Invalid project brief." }, { status: 400 });
    }

    const lang = body.lang === "id" ? "id" : "en";
    const name = normalizeText(body.name);
    const needs = normalizeText(body.needs);
    const message = buildEmailMarkup({ name, email, needs, lang });

    const webhookUrl = process.env.CONTACT_FORM_WEBHOOK_URL;
    if (webhookUrl) {
      await sendViaWebhook({
        webhookUrl,
        payload: {
          name,
          email,
          needs,
          lang,
          subject: message.subject,
          html: message.html,
          text: message.text,
        },
      });

      return NextResponse.json({ ok: true });
    }

    const contactToRecipients = parseRecipientList(
      process.env.CONTACT_TO_EMAIL || "jasmine.adlina@gmail.com"
    );
    const contactFromEmail =
      process.env.CONTACT_FROM_EMAIL || process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

    if (!contactFromEmail) {
      return NextResponse.json(
        {
          ok: false,
          code: "delivery_unavailable",
          message: "Email delivery is not configured. Please set SMTP credentials first.",
        },
        { status: 503 }
      );
    }

    if (
      contactToRecipients.length === 0 ||
      contactToRecipients.some((recipient) => !isValidConfiguredEmail(recipient))
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: "invalid_to_email",
          message: "CONTACT_TO_EMAIL must contain one or more valid email addresses.",
        },
        { status: 500 }
      );
    }

    if (!isValidConfiguredEmail(contactFromEmail)) {
      return NextResponse.json(
        {
          ok: false,
          code: "invalid_from_email",
          message: "CONTACT_FROM_EMAIL must be a valid sender address.",
        },
        { status: 500 }
      );
    }

    await sendViaSmtp({
      to: contactToRecipients,
      from: contactFromEmail,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = normalizeErrorMessage(error);

    console.error("[contact-form] delivery failed", {
      message,
      hasWebhookUrl: Boolean(process.env.CONTACT_FORM_WEBHOOK_URL),
      hasSmtpUser: Boolean(process.env.SMTP_USER),
      hasSmtpPass: Boolean(process.env.SMTP_PASS),
      smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
      smtpPort: process.env.SMTP_PORT || "465",
      contactFromEmail:
        process.env.CONTACT_FROM_EMAIL ?? process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER ?? null,
      contactToEmail: process.env.CONTACT_TO_EMAIL ?? "jasmine.adlina@gmail.com",
    });

    return NextResponse.json(
      {
        ok: false,
        code: "delivery_failed",
        message,
      },
      { status: 500 }
    );
  }
}
