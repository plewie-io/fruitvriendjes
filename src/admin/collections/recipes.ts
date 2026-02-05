import { buildCollection, buildProperty } from "@firecms/core";

export type Recipe = {
  sessionId: string;
  userId: string;
  ingredients: string;
  recipe: string;
  imagePrompt: string;
  imageUrl: string | null;
  isModification: boolean;
  previousRecipeId: string | null;
  createdAt: Date;
};

export const recipesCollection = buildCollection<Recipe>({
  id: "recipes",
  path: "recipes",
  name: "Recepten",
  singularName: "Recept",
  group: "Data",
  icon: "Restaurant",
  description: "Recepten gegenereerd door AI tijdens een recepten chat sessie",
  defaultSize: "xs",
  initialSort: ["createdAt", "desc"],
  textSearchEnabled: false,
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
    ingredients: buildProperty({
      name: "Ingrediënten",
      dataType: "string",
      multiline: true,
      validation: { required: true },
    }),
    recipe: buildProperty({
      name: "Recept",
      dataType: "string",
      multiline: true,
      markdown: true,
      validation: { required: true },
    }),
    imagePrompt: buildProperty({
      name: "Afbeelding prompt",
      dataType: "string",
      multiline: true,
      hideFromCollection: true,
    }),
    imageUrl: buildProperty({
      name: "Afbeelding",
      dataType: "string",
      storage: {
        mediaType: "image",
        storagePath: "recipes",
        acceptedFiles: ["image/*"],
      },
    }),
    isModification: buildProperty({
      name: "Is aanpassing",
      dataType: "boolean",
      columnWidth: 120,
    }),
    previousRecipeId: buildProperty({
      name: "Vorige recept-ID",
      dataType: "string",
      hideFromCollection: true,
    }),
    createdAt: buildProperty({
      name: "Aangemaakt op",
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
