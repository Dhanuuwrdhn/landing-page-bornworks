import { NextResponse } from "next/server";

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

async function sendViaResend({
  to,
  from,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  replyTo: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      text,
      reply_to: replyTo,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend delivery failed: ${errorText}`);
  }
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

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactToEmail = process.env.CONTACT_TO_EMAIL || "hello@bornworks.id";
    const contactFromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!resendApiKey || !contactFromEmail) {
      return NextResponse.json(
        {
          ok: false,
          code: "delivery_unavailable",
          message: "Contact delivery is not configured.",
        },
        { status: 503 }
      );
    }

    await sendViaResend({
      to: contactToEmail,
      from: contactFromEmail,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Unable to process the contact request.",
      },
      { status: 500 }
    );
  }
}
