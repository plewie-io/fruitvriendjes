// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAI, getTemplateGenerativeModel, getImagenModel, VertexAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaV3Provider, ReCaptchaEnterpriseProvider } from "firebase/app-check";

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

// Create an ImagenModel instance for image generation
export const imagenModel = getImagenModel(ai, {
  model: "imagen-4.0-generate-001",
  generationConfig: {
    numberOfImages: 1
  }
});

// Function to generate recipe using Firebase AI template
export async function generateRecipe(ingredients: string): Promise<string> {
  try {
    const input = {
      ingredients: ingredients
    };

    const result = await templateModel.generateContent(
      // Template ID for recipe generation
      "recept-maken",
      // Provide the values for template variables
      input,

    );

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Firebase AI error:", error);
    throw error;
  }
}

// Function to generate a photo prompt from a recipe
export async function generatePhotoPrompt(recipe: string): Promise<string> {
  try {
    const input = {
      recipe: recipe
    };

    const result = await templateModel.generateContent(
      "foto-prompt-maken",
      input
    );

    const response = result.response;
    const promptText = response.text();
    console.log("📸 Generated photo prompt:", promptText);
    return promptText;
  } catch (error) {
    console.error("Firebase AI photo prompt error:", error);
    throw error;
  }
}

// Function to generate a recipe photo from a prompt
export async function generateRecipePhoto(prompt: string): Promise<string> {
  try {
    console.log("🖼️ Generating image with prompt:", prompt);
    
    const result = await imagenModel.generateImages(prompt);
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

export { app, analytics };
