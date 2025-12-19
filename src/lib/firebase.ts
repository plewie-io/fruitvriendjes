// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAI, getGenerativeModel, getTemplateGenerativeModel, getTemplateImagenModel, VertexAIBackend, HarmCategory, HarmBlockThreshold } from "firebase/ai";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, updateDoc, serverTimestamp, Timestamp, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

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

// Initialize the Vertex AI Gemini API backend service with European region
export const ai = getAI(app, { backend: new VertexAIBackend('europe-west4') });

// Create a TemplateGenerativeModel instance
export const templateModel = getTemplateGenerativeModel(ai);

// Create a TemplateImagenModel instance for image generation
export const templateImagenModel = getTemplateImagenModel(ai);

// Safety settings for the chat model
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Create a GenerativeModel instance for chat with Google Search grounding
export const chatModel = getGenerativeModel(ai, { 
  model: "gemini-2.5-flash",
  tools: [{ googleSearch: {} }],
  safetySettings
});

// Current user and session state
let currentUser: User | null = null;
let currentSessionId: string | null = null;

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (!user) {
    currentSessionId = null;
  }
});

// Sign in anonymously and create a new session
export async function signInAndCreateSession(fruitCharacter: string): Promise<string> {
  try {
    // Sign in anonymously if not already signed in
    if (!currentUser) {
      const userCredential = await signInAnonymously(auth);
      currentUser = userCredential.user;
      console.log("🔐 Signed in anonymously:", currentUser.uid);
    }

    // Create a new session in Firestore
    const sessionRef = await addDoc(collection(db, "sessions"), {
      userId: currentUser.uid,
      fruitCharacter: fruitCharacter,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    currentSessionId = sessionRef.id;
    console.log("📝 Created session:", currentSessionId);

    return currentSessionId;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

// Get current session ID
export function getCurrentSessionId(): string | null {
  return currentSessionId;
}

// Get current user
export function getCurrentUser(): User | null {
  return currentUser;
}

// Save a recipe generation to Firestore
export async function saveRecipeGeneration(
  ingredients: string,
  recipe: string,
  imagePrompt: string,
  imageDataUrl: string | null,
  isModification: boolean = false,
  previousRecipeId: string | null = null
): Promise<string> {
  if (!currentUser || !currentSessionId) {
    throw new Error("No active session. Please sign in first.");
  }

  try {
    let imageUrl: string | null = null;

    // Upload image to Storage if provided
    if (imageDataUrl) {
      const imagePath = `recipes/${currentSessionId}/${Date.now()}.png`;
      const imageRef = ref(storage, imagePath);
      await uploadString(imageRef, imageDataUrl, 'data_url');
      imageUrl = await getDownloadURL(imageRef);
      console.log("📸 Image uploaded:", imageUrl);
    }

    // Save recipe to Firestore
    const recipeDoc = await addDoc(collection(db, "recipes"), {
      sessionId: currentSessionId,
      userId: currentUser.uid,
      ingredients: ingredients,
      recipe: recipe,
      imagePrompt: imagePrompt,
      imageUrl: imageUrl,
      isModification: isModification,
      previousRecipeId: previousRecipeId,
      createdAt: serverTimestamp()
    });

    // Update session's updatedAt timestamp
    await updateDoc(doc(db, "sessions", currentSessionId), {
      updatedAt: serverTimestamp()
    });

    console.log("💾 Recipe saved:", recipeDoc.id);
    return recipeDoc.id;
  } catch (error) {
    console.error("Error saving recipe:", error);
    throw error;
  }
}

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

// Chat session management
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let currentChatSession: any = null;
let currentChatSessionId: string | null = null;

// Chat message type for history
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// System prompt for Annie de Ananas
const ANNIE_SYSTEM_PROMPT = `Je bent Annie de Ananas, een vriendelijke en behulpzame fruitvriendin die vragen beantwoordt over Schoolfruit en het EU Schoolfruit programma.

BELANGRIJKE REGELS:
- Stel jezelf voor als Annie de Ananas als dat passend is
- Beantwoord ALLEEN vragen die gerelateerd zijn aan Schoolfruit, het EU Schoolfruit programma, fruit en groenten op scholen, en de producten en dienstverlening
- Als de vraag NIET over Schoolfruit of gerelateerde onderwerpen gaat, zeg dan vriendelijk dat je alleen vragen over Schoolfruit kunt beantwoorden
- Gebruik Google Search om actuele informatie van schoolfruit.nl te vinden
- Wees vriendelijk, enthousiast en behulpzaam
- Geef korte, duidelijke antwoorden
- Als je iets niet weet, zeg dat eerlijk en verwijs naar www.schoolfruit.nl
- Gebruik af en toe een ananas emoji 🍍 om je karakter te benadrukken
- Antwoord altijd in het Nederlands`;

// Ensure we have an authenticated session for chat
export async function ensureChatSession(): Promise<string> {
  // If we already have a session, return it
  if (currentUser && currentSessionId) {
    return currentSessionId;
  }

  // Create a new anonymous session for chat
  return await signInAndCreateSession("annie-ananas");
}

// Start or continue a chat session
export async function startChatSession(existingHistory: ChatMessage[] = []): Promise<void> {
  // Ensure we have auth session
  await ensureChatSession();

  // Convert our message format to Firebase AI format
  const firebaseHistory = existingHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  // Add system instruction as first message pair in history
  const historyWithSystem = [
    {
      role: "user" as const,
      parts: [{ text: `Instructies voor deze chat sessie:\n\n${ANNIE_SYSTEM_PROMPT}\n\nBevestig dat je dit begrijpt.` }]
    },
    {
      role: "model" as const,
      parts: [{ text: "Begrepen! Ik ben Annie de Ananas 🍍 en ik help je graag met al je vragen over Schoolfruit en het EU Schoolfruit programma!" }]
    },
    ...firebaseHistory
  ];

  // Start new chat with history
  currentChatSession = chatModel.startChat({
    history: historyWithSystem,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  // Create a new chat session document in Firestore if we don't have one
  if (!currentChatSessionId && currentSessionId) {
    const chatSessionRef = await addDoc(collection(db, "chatSessions"), {
      sessionId: currentSessionId,
      userId: currentUser!.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messages: existingHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date().toISOString()
      }))
    });
    currentChatSessionId = chatSessionRef.id;
    console.log("💬 Created chat session:", currentChatSessionId);
  }
}

// Send a message in the chat (with optional streaming callback)
export async function sendChatMessage(
  message: string, 
  onChunk?: (text: string) => void
): Promise<string> {
  // Start a new chat session if we don't have one
  if (!currentChatSession) {
    await startChatSession();
  }

  try {
    let responseText = '';
    
    if (onChunk) {
      // Use streaming for real-time updates
      const result = await currentChatSession!.sendMessageStream(message);
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        responseText += chunkText;
        onChunk(responseText); // Send accumulated text to callback
      }
    } else {
      // Non-streaming fallback
      const result = await currentChatSession!.sendMessage(message);
      responseText = result.response.text();
    }

    // Save messages to Firestore
    if (currentChatSessionId) {
      const chatSessionRef = doc(db, "chatSessions", currentChatSessionId);
      const chatSessionDoc = await getDoc(chatSessionRef);
      
      if (chatSessionDoc.exists()) {
        const existingMessages = chatSessionDoc.data().messages || [];
        await updateDoc(chatSessionRef, {
          messages: [
            ...existingMessages,
            { role: 'user', content: message, timestamp: new Date().toISOString() },
            { role: 'model', content: responseText, timestamp: new Date().toISOString() }
          ],
          updatedAt: serverTimestamp()
        });
      }
    }

    console.log("💬 Chat response:", responseText);
    return responseText;
  } catch (error: any) {
    console.error("Chat error:", error);
    
    // Check if this is a safety block error
    if (error?.message?.includes('SAFETY') || error?.code === 'AI/response-error') {
      // Reset chat session to prevent malformed history from blocking subsequent messages
      currentChatSession = null;
      
      const safetyError = new Error('SAFETY_BLOCK');
      safetyError.name = 'SafetyBlockError';
      throw safetyError;
    }
    
    throw error;
  }
}

// Reset chat session (for starting a new conversation)
export function resetChatSession(): void {
  currentChatSession = null;
  currentChatSessionId = null;
  console.log("🔄 Chat session reset");
}

export { app, analytics };
