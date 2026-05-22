import { auth } from "@clerk/nextjs/server"

export const getUserId = async () => {
  const { userId } = await auth({ acceptsToken: "session_token" });
  return userId;
}
