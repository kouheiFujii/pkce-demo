<script lang="ts" setup>
import {
  createRandomString,
  encode,
  sha256,
  bufferToBase64UrlEncoded,
  createQueryParams,
} from "@/service/utils";

const route = useRoute();
const code = route.query.code as string;
// const state = route.query.state as string;
const domain = useRuntimeConfig().NUXT_APP_AUTH0_DOMAIN;
const client_id = useRuntimeConfig().NUXT_APP_AUTH0_CLIENT_ID;
const audience = useRuntimeConfig().NUXT_APP_AUTH0_AUDIENCE;

const code_verifier = localStorage.getItem("verifier");
localStorage.removeItem("verifier");

const requestToken = async () => {
  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
  });
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id,
    code_verifier,
    code,
    redirect_uri: window.location.origin,
  });

  const token = await fetch(`https://${domain}/oauth/token`, {
    method: "POST",
    body,
    headers,
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
  console.log(token);
};

const onSubmit = async () => {
  // const state = encode(createRandomString());
  // const nonce = encode(createRandomString());
  const code_verifier = createRandomString();
  const code_challengeBuffer = await sha256(code_verifier);
  const code_challenge = bufferToBase64UrlEncoded(code_challengeBuffer);

  localStorage.setItem("verifier", code_verifier);
  // https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow-with-pkce#example-authorization-url
  const params = {
    response_type: "code", // required
    client_id, // required
    // state,
    // nonce,
    audience,
    redirect_uri: window.location.href, // required
    code_challenge, // auth0側で値を保持し、tokenリクエストの際に確認のため使用する
    code_challenge_method: "S256", // code_verifier がどのような方法で code_challenge に変換されているのか変換方式を示す。
    scode: "openid profile email read:appointments",
  };
  window.location.assign(
    `https://${domain}/authorize?${createQueryParams(params)}`
  );
};
</script>

<template>
  <div>
    <p>Resister as a member!</p>

    <button type="button" @click="onSubmit">register</button>

    <p v-if="code">
      <!-- <p v-if="code && state"> -->
      <button @click="requestToken">request token</button>
    </p>
  </div>
</template>
