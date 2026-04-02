import { EmailMessage } from "cloudflare:email";

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const name    = (formData.get("name")    || "").trim();
    const email   = (formData.get("email")   || "").trim();
    const message = (formData.get("message") || "").trim();

    if (!name || !email || !message) {
      return Response.json({ error: "Champs manquants" }, { status: 400 });
    }

    const body = `Nouveau message de support Onsorga\n\nNom : ${name}\nEmail : ${email}\n\nMessage :\n${message}`;

    const raw = [
      `From: Onsorga Support <noreply@onsorga.com>`,
      `To: support@onsorga.com <joseph.solier.pro@gmail.com>`,
      `Reply-To: ${name} <${email}>`,
      `Subject: [Support Onsorga] Message de ${name}`,
      `Content-Type: text/plain; charset=utf-8`,
      ``,
      body,
    ].join("\r\n");

    const msg = new EmailMessage(
      "noreply@onsorga.com",
      "joseph.solier.pro@gmail.com",
      raw
    );

    await env.EMAIL.send(msg);

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
