type ApiMessage = {
  roomId: string;
  roomSlug: string;
  username: string;
  avatar: string;
  body: string;
};

const isVercel = !!(
  process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV
);

class ApiClient {
  get API_BASE_URL() {
    if (isVercel) return "https://ruben30.com";
    return "http://localhost:3000";
  }

  async sendMessage(msg: ApiMessage): Promise<any> {
    const apiPath = "/api/message";

    const response = await fetch(this.API_BASE_URL + "/api/message", {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;
