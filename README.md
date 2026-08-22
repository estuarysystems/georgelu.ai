# georgelu.ai

Personal site. Spec is in [`spec/personal-site.md`](spec/personal-site.md).

Domain: [georgelu.ai](https://georgelu.ai)

A hobby-resume you drive like a console. Home is a vertical XMB (me, world, work, hobby). Items open MDX essays.

## Stack

Static Next.js app. MDX essays. No backend. Production is Google Cloud Run; DNS is on GoDaddy. `vercel.json` is test-only.

```bash
npm install
npm run dev
```

```bash
npm run build
```

## Cloud Run

The app builds with `output: "standalone"` and the `Dockerfile` listens on `PORT` (default `8080`) at `0.0.0.0`.

```bash
gcloud run deploy georgelu-ai \
  --source . \
  --region us-west1 \
  --allow-unauthenticated \
  --port 8080
```

Optional: `cloudbuild.yaml` builds and deploys the same service (`georgelu-ai`, `us-west1`) after you create the Artifact Registry Docker repo named `georgelu-ai` in that region.

### Domain (GoDaddy)

GoDaddy holds `georgelu.ai`. After you map the domain in Cloud Run, add the **exact** records Cloud Run shows. Do not invent IPs or CNAMEs.

Turn off Website Builder / Launching Soon first so GoDaddy stops serving its parked page. Leave MX records alone.

## Contents

Thirteen essays on four shelves. Unlisted `/all` lists every essay by shelf. Theme follows the system (auto). Accent color is light-mode links only.
