require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000;

// Spotify API Credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/callback";

app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

// Step 1: Redirect user to Spotify Authorization Page
app.get("/login", (req, res) => {
  const scope = "user-top-read";
  const authURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(scope)}`;
  res.redirect(authURL);
});
// Step 2: Spotify Redirects with Authorization Code
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: "Authorization code missing" });
  }
  // Step 3: Exchange Authorization Code for Access Token
  const tokenResponse = await global.fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    }
  );
  const tokenData = await tokenResponse.json();
  if (tokenData.error) {
    return res.status(400).json({ error: tokenData.error_description });
  }
  res.redirect(`/top-tracks?access_token=${tokenData.access_token}`);
});

// Step 4: Fetch User's Top 100 Tracks
app.get("/top-tracks", async (req, res) => {
  const accessToken = req.query.access_token;
  if (!accessToken) {
    return res.status(401).json({ error: "Access token missing" });
  }
  try {
    const [response1, response2] = await Promise.all([
      global.fetch("https://api.spotify.com/v1/me/top/tracks?limit=50", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      global.fetch(
        "https://api.spotify.com/v1/me/top/tracks?offset=50&limit=50",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      ),
    ]);
    const data1 = await response1.json();
    const data2 = await response2.json();
    // Merge track items from both responses
    const mergedItems = data1.items.concat(data2.items);
    console.log("Number of merged items:", mergedItems.length);
    // Remove attributes that are not needed
    const cleanedItems = mergedItems.map((track) => {
      const {
        available_markets,
        album,
        href,
        is_local,
        is_playable,
        preview_url,
        track_number,
        type,
        uri,
        disc_number,
        external_ids,
        external_urls,
        ...trackWithoutMarkets
      } = track;
      return trackWithoutMarkets;
    });
    res.json({ cleanedItems });
    //res.render("dashboard", { data: cleanedItems });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
