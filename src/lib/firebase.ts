// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAI, getTemplateGenerativeModel, getTemplateImagenModel, VertexAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDggrdZnKpTZPQztoWoQwrbH2l_jr9G_A",
  authDomain: "fruitvriendjes-35c8c.firebaseapp.com",
  projectId: "fruitvriendjes-35c8c",
  storageBucket: "fruitvriendjes-35c8c.firebasestorage.app",
  messagingSenderId: "104281679692",
  appId: "1:104281679692:web:6754372d57f65ed53e11e9",
  measurementId: "G-P1C709MBME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize App Check with debug token for local development
if (typeof window !== 'undefined') {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Enable debug mode - this will generate and log a debug token
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
}

export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider("6LcQeC4sAAAAAIcJR51ruWdvVg16DQYMgNsrmLsT"),
  isTokenAutoRefreshEnabled: true
});

// Initialize the Vertex AI Gemini API backend service
export const ai = getAI(app, { backend: new VertexAIBackend() });

// Create a TemplateGenerativeModel instance
export const templateModel = getTemplateGenerativeModel(ai);

// Create a TemplateImagenModel instance for image generation
export const templateImagenModel = getTemplateImagenModel(ai);

// Type for the structured recipe response
export interface RecipeResponse {
  recipe: string;
  imagePrompt: string;
  isValidRequest: boolean;
}

// Function to generate recipe using Firebase AI template
export async function generateRecipe(ingredients: string, template: string = "mandy-mandarijn"): Promise<RecipeResponse> {
  try {
    const input = {
      ingredients: ingredients
    };

    const result = await templateModel.generateContent(
      template,
      input,
    );

    const response = result.response;
    const text = response.text();
    console.log("📝 Raw recipe response:", text);
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(text);
    return {
      recipe: parsedResponse.recipe,
      imagePrompt: parsedResponse.imagePrompt,
      isValidRequest: parsedResponse.isValidRequest ?? false
    };
  } catch (error) {
    console.error("Firebase AI error:", error);
    throw error;
  }
}

// Function to generate a recipe photo from a prompt
export async function generateRecipePhoto(prompt: string): Promise<string> {
  try {
    console.log("🖼️ Generating image with prompt:", prompt);
    
    const result = await templateImagenModel.generateImages(
      "afbeelding-genereren",
      { prompt: prompt }
    );
    console.log("🖼️ Image generation response:", result);
    
    // Get the first generated image
    const image = result.images[0];
    if (image) {
      // Return as data URL
      const imageData = image.bytesBase64Encoded;
      const mimeType = image.mimeType || "image/png";
      return `data:${mimeType};base64,${imageData}`;
    }
    
    throw new Error("No image found in response");
  } catch (error) {
    console.error("Firebase AI photo generation error:", error);
    throw error;
  }
}

// Function to modify an existing recipe
export async function modifyRecipe(previousRecipe: string, modifications: string): Promise<RecipeResponse> {
  try {
    const input = {
      previousRecipe: previousRecipe,
      modifications: modifications
    };

    const result = await templateModel.generateContent(
      "recept-aanpassen",
      input,
    );

    const response = result.response;
    const text = response.text();
    console.log("📝 Raw modified recipe response:", text);
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(text);
    return {
      recipe: parsedResponse.recipe,
      imagePrompt: parsedResponse.imagePrompt,
      isValidRequest: parsedResponse.isValidRequest ?? false
    };
  } catch (error) {
    console.error("Firebase AI modify recipe error:", error);
    throw error;
  }
}

export { app, analytics };
