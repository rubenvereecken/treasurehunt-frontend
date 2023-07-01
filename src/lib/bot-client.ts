import axios from "axios";

type BotMessage = {
  message: string;
  username: string;
  roomSlug: string;
  // TODO use this field
  ismod: boolean;
};

type BotReply = {
  reply: string;
};

const isVercel = !!(
  process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV
);

class BotClient {
  get API_BASE_URL() {
    if (isVercel)
      return "https://mn8ylu5hg8.execute-api.us-east-1.amazonaws.com";
    return "http://localhost:3001";
  }

  async sendMessage(msg: BotMessage): Promise<BotReply> {
    const apiPath = "/huntgpt";

    const res = await axios.post(this.API_BASE_URL + apiPath, msg);
    return res.data;
  }
}

const botClient = new BotClient();
export default botClient;
