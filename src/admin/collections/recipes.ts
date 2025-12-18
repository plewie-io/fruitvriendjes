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
  name: "Recipes",
  singularName: "Recipe",
  group: "Data",
  icon: "Restaurant",
  description: "Generated recipes from the Fruitvriendjes app",
  defaultSize: "xs",
  initialSort: ["createdAt", "desc"],
  textSearchEnabled: false,
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
    ingredients: buildProperty({
      name: "Ingredients",
      dataType: "string",
      multiline: true,
      validation: { required: true },
    }),
    recipe: buildProperty({
      name: "Recipe",
      dataType: "string",
      multiline: true,
      markdown: true,
      validation: { required: true },
    }),
    imagePrompt: buildProperty({
      name: "Image Prompt",
      dataType: "string",
      multiline: true,
    }),
    imageUrl: buildProperty({
      name: "Image",
      dataType: "string",
      storage: {
        mediaType: "image",
        storagePath: "recipes",
        acceptedFiles: ["image/*"],
      },
    }),
    isModification: buildProperty({
      name: "Is Modification",
      dataType: "boolean",
      columnWidth: 120,
    }),
    previousRecipeId: buildProperty({
      name: "Previous Recipe ID",
      dataType: "string",
    }),
    createdAt: buildProperty({
      name: "Created At",
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
