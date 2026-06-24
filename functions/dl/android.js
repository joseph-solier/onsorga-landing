// Proxy de téléchargement de l'APK Android.
// Au lieu d'exposer l'URL GitHub (release-assets.githubusercontent.com — qui fait
// "louche" dans le prompt Safari), on streame la dernière release depuis onsorga.com.
// Le navigateur ne voit que le domaine onsorga.com.
const APK = "https://github.com/joseph-solier/onsorga_releases/releases/latest/download/Onsorga-Android.apk";

export async function onRequestGet() {
  const upstream = await fetch(APK, {
    redirect: "follow",
    headers: { "User-Agent": "onsorga-download-proxy" },
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Téléchargement indisponible, réessaie dans un instant.", {
      status: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const headers = new Headers();
  headers.set("Content-Type", "application/vnd.android.package-archive");
  headers.set("Content-Disposition", 'attachment; filename="Onsorga-Android.apk"');
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  headers.set("Cache-Control", "public, max-age=900");

  return new Response(upstream.body, { status: 200, headers });
}
