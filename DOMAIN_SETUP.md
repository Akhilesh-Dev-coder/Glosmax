# Domain Setup: GoDaddy -> Netlify & Hostinger

You have a **Split Hosting Setup**:

1.  **Frontend (UI)**: Hosted on **Netlify**.
2.  **Backend (API)**: Hosted on **Hostinger**.
3.  **Domain**: Purchased on **GoDaddy** (e.g., `glosmax.com`).

## Strategy

We will point your **main domain** (`glosmax.com`) to **Netlify** so people see your website.
We will point a **subdomain** (`api.glosmax.com` or `server.glosmax.com`) to **Hostinger** so your frontend can talk to the backend.

---

## Part 1: Configure Frontend (Netlify)

1.  **Log in to Netlify**.
2.  Go to **Site Settings** > **Domain management**.
3.  Click **"Add a domain"**.
4.  Enter your domain (e.g., `glosmax.com`).
5.  Click **"Verify"** -> **"Add domain"**.
6.  Netlify will tell you to add DNS records. Note the **"Netlify Load Balancer IP"** (usually `75.2.60.5`) and your site URL (e.g., `glosmax.netlify.app`).

## Part 2: Configure Backend (Hostinger)

1.  **Log in to Hostinger**.
2.  Go to **Hosting** > **Manage** > **Details** (or **Account Details** on the side).
3.  Find your **Website IP Address** (e.g., `123.456.78.90`). **Copy this.**
4.  (Optional but recommended) In Hostinger, add the subdomain `api.glosmax.com` under **Domains** > **Subdomains** so Hostinger knows to serve files there.

## Part 3: Configure DNS in GoDaddy

1.  **Log in to GoDaddy**.
2.  Go to **Domain Portfolio** > Select your domain > **DNS**.
3.  **Delete** any existing A records with name `@` if they point to "Parked".
4.  **Add/Edit these specific records:**

### A. Point Main Site to Netlify

| Type      | Name  | Value                    | TTL    |
| :-------- | :---- | :----------------------- | :----- |
| **A**     | `@`   | `75.2.60.5` (Netlify IP) | 1 Hour |
| **CNAME** | `www` | `glosmax.netlify.app`    | 1 Hour |

_(Replace `glosmax.netlify.app` with your actual Netlify site name)_

### B. Point Backend to Hostinger

| Type  | Name  | Value                 | TTL    |
| :---- | :---- | :-------------------- | :----- |
| **A** | `api` | `[YOUR_HOSTINGER_IP]` | 1 Hour |

_(Replace `[YOUR_HOSTINGER_IP]` with the IP you copied from Hostinger, e.g., `185.123.45.67`)_

---

## Part 4: Final Connection (Important!)

Now that your backend is at `api.glosmax.com` (or whatever subdomain you chose):

1.  **Update Frontend Code**: In your Netlify environment variables (or `.env`), change your `VITE_API_URL` to:
    `https://api.glosmax.com`
2.  **Update Backend Code**: In `server/index.js`, update CORS to allow:
    `https://www.glosmax.com` and `https://glosmax.com`

_DNS changes can take up to 24 hours to propagate._
