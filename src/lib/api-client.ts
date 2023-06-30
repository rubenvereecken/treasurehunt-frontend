type ApiMessage = {
  roomId: string;
  roomSlug: string;
  username: string;
  avatar: string;
  body: string;
};

const isLambda = !!process.env.LAMBDA_TASK_ROOT;

class ApiClient {
  get API_BASE_URL() {
    if (isLambda) return "https://ruben30.com";
    return "http://localhost:3001";
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
