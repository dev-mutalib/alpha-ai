export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
};
