import { buildCollection, buildProperty } from "@firecms/core";

export type Session = {
  userId: string;
  fruitCharacter: string;
  createdAt: Date;
  updatedAt: Date;
};

export const sessionsCollection = buildCollection<Session>({
  id: "sessions",
  path: "sessions",
  name: "Sessions",
  singularName: "Session",
  group: "Data",
  icon: "People",
  description: "User sessions for the Fruitvriendjes app",
  defaultSize: "xs",
  initialSort: ["createdAt", "desc"],
  properties: {
    userId: buildProperty({
      name: "User ID",
      dataType: "string",
      readOnly: true,
    }),
    fruitCharacter: buildProperty({
      name: "Fruit Character",
      dataType: "string",
      enumValues: {
        "mandy-mandarijn": "Mandy Mandarijn",
        "annie-ananas": "Annie Ananas",
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
