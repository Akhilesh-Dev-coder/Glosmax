# How to Connect Netlify to Hostinger Backend

Your code is already perfect! Now you just need to tell Netlify where your backend is.

## Step 1: Add Environment Variable in Netlify

1.  Log in to your **Netlify Dashboard**.
2.  Click on your site (e.g., `glosmax`).
3.  Go to **Site configuration** > **Environment variables**.
4.  Click **"Add a variable"**.
5.  Enter these details:
    - **Key**: `VITE_BACKEND_URL`
    - **Value**: `https://api.glosmax.in`
6.  Click **Create variable**.

## Step 2: Redeploy Your Site

**Crucial Step:** Environment variables only take effect _after_ a new deployment.

1.  Go to the **Deploys** tab in Netlify.
2.  Click **"Trigger deploy"** > **"Deploy site"**.
3.  Wait for the build to finish (usually 1-2 minutes).

## Step 3: Verify

1.  Open your website: `https://glosmax.in` (or your Netlify URL).
2.  Open **Developer Tools** (F12) -> **Network** tab.
3.  Try to Log In or view usage.
4.  You should see requests going to `https://api.glosmax.in/...` instead of `localhost`.

---

**Note:** If you ever change your backend URL, just update this variable in Netlify and redeploy!
