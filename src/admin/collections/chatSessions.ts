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
  name: "Chatsessies",
  singularName: "Chatsessie",
  group: "Data",
  icon: "Chat",
  description: "Chats met de chatbot onderin de pagina",
  defaultSize: "xs",
  initialSort: ["createdAt", "desc"],
  properties: {
    sessionId: buildProperty({
      name: "Sessie",
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
      name: "Gebruikers-ID",
      dataType: "string",
      readOnly: true,
      hideFromCollection: true,
    }),
    messages: buildProperty({
      name: "Berichten",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          role: {
            name: "Rol",
            dataType: "string",
            enumValues: {
              user: "Gebruiker",
              model: "Model",
            },
          },
          content: {
            name: "Inhoud",
            dataType: "string",
            multiline: true,
          },
          timestamp: {
            name: "Tijdstempel",
            dataType: "string",
          },
        },
      },
    }),
    createdAt: buildProperty({
      name: "Aangemaakt op",
      dataType: "date",
      readOnly: true,
      mode: "date_time",
    }),
    updatedAt: buildProperty({
      name: "Bijgewerkt op",
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
