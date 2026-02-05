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
  name: "Sessies",
  singularName: "Sessie",
  group: "Data",
  icon: "People",
  description: "Recepten chat sessies - elke sessie is een recepten chat",
  defaultSize: "xs",
  initialSort: ["createdAt", "desc"],
  properties: {
    userId: buildProperty({
      name: "Gebruikers-ID",
      dataType: "string",
      readOnly: true,
      hideFromCollection: true,
    }),
    fruitCharacter: buildProperty({
      name: "Fruitpersonage",
      dataType: "string",
      enumValues: {
        "mandy-mandarijn": "Mandy Mandarijn",
        "annie-ananas": "Annie Ananas",
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
