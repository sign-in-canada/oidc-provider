# oidc-provider

Create a config.ts that looks something like this:

```
export default {
  clients: [
    {
      client_id: "someclient",
      client_secret: "somesecret",
      grant_types: ["refresh_token", "authorization_code"],
      redirect_uris: [
        "http://localhost:3100/auth/callback",
        "http://sso-client.dev/providers/8/open_id",
      ],
    },
  ],
  interactions: {
    url(ctx, interaction) {
      // eslint-disable-line no-unused-vars
      return `/interaction/${interaction.uid}`;
    },
  },
  cookies: {
    keys: [
      "some secret key",
      "and also the old rotated away some time ago",
      "and one more",
    ],
  },
  claims: {
    address: ["address"],
    email: ["email", "email_verified"],
    phone: ["phone_number", "phone_number_verified"],
    profile: [
      "birthdate",
      "family_name",
      "gender",
      "given_name",
      "locale",
      "middle_name",
      "name",
      "nickname",
      "picture",
      "preferred_username",
      "profile",
      "updated_at",
      "website",
      "zoneinfo",
    ],
  },
  features: {
    devInteractions: { enabled: false }, // defaults to true

    deviceFlow: { enabled: true }, // defaults to false
    revocation: { enabled: true }, // defaults to false
  },
  pkce: {
    required: (ctx, client) => true,
  },
  jwks: {
    keys: [
      {
        d: "...",
        dp: "...",
        dq: "...",
        e: "AQAB",
        kty: "RSA",
        n: "...",
        p: "...",
        q: "...",
        qi: "...",
        use: "sig",
      },
      {
        crv: "P-256",
        d: "...",
        kty: "EC",
        use: "sig",
        x: "...",
        y: "...",
      },
    ],
  },
};

```
