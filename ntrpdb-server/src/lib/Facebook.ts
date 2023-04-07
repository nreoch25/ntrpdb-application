import request from "superagent";

const Facebook = {
  authUrl: (): string => {
    const redirect_url = encodeURIComponent(`${process.env.REDIRECT_URL}`);
    return `https://www.facebook.com/v6.0/dialog/oauth?client_id=${process.env.FB_CLIENT_ID}&redirect_uri=${redirect_url}&scope=email,user_photos`;
  },
  logIn: async (code: string): Promise<Record<string, unknown>> => {
    console.log({ code });
    const res = await request
      .post("https://graph.facebook.com/v6.0/oauth/access_token")
      .send(`client_id=${process.env.FB_CLIENT_ID}`)
      .send(`client_secret=${process.env.FB_CLIENT_SECRET}`)
      .send(`redirect_uri=${process.env.REDIRECT_URL}`)
      .send(`code=${code}`);

    const data = await request.get(
      `https://graph.facebook.com/me?access_token=${encodeURIComponent(
        res.body.access_token
      )}&fields=id,email,first_name,last_name,picture.height(150)`
    );

    const user = JSON.parse(data.text);

    return { user };
  },
};

export { Facebook };
