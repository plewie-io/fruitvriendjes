import { buildCollection, buildProperty } from "@firecms/core";

export type ChatMessage = {
  role: "user" | "model";
  content: string;
  timestamp: string;
};

export type ChatSession = {
  sessionId: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
};

export const chatSessionsCollection = buildCollection<ChatSession>({
  id: "chatSessions",
  path: "chatSessions",
  name: "Chat Sessions",
  singularName: "Chat Session",
  group: "Data",
  icon: "Chat",
  description: "Chat conversations with Annie de Ananas",
  defaultSize: "xs",
  initialSort: ["createdAt", "desc"],
  properties: {
    sessionId: buildProperty({
      name: "Session",
      dataType: "string",
      readOnly: true,
      // Use string as reference to sessions collection
      reference: {
        dataType: "reference",
        path: "sessions",
        previewProperties: ["fruitCharacter", "createdAt"],
      },
    }),
    userId: buildProperty({
      name: "User ID",
      dataType: "string",
      readOnly: true,
    }),
    messages: buildProperty({
      name: "Messages",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          role: {
            name: "Role",
            dataType: "string",
            enumValues: {
              user: "User",
              model: "Model",
            },
          },
          content: {
            name: "Content",
            dataType: "string",
            multiline: true,
          },
          timestamp: {
            name: "Timestamp",
            dataType: "string",
          },
        },
      },
    }),
    createdAt: buildProperty({
      name: "Created At",
      dataType: "date",
      readOnly: true,
      mode: "date_time",
    }),
    updatedAt: buildProperty({
      name: "Updated At",
      dataType: "date",
      readOnly: true,
      mode: "date_time",
    }),
  },
  permissions: () => ({
    read: true,
    edit: false,
    create: false,
    delete: false,
  }),
});
