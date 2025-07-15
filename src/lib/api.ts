
// API Configuration File
// This is where you'll add your API keys and endpoints

export const API_CONFIG = {
  // Gemini AI Configuration
  GEMINI: {
    API_KEY: '', // Paste your Gemini API key here
    ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  },
  
  // MongoDB Configuration
  MONGODB: {
    CONNECTION_STRING: '', // Paste your MongoDB connection string here
    DATABASE_NAME: 'doctor_portal',
    COLLECTIONS: {
      PRESCRIPTIONS: 'prescriptions',
      PATIENTS: 'patients',
      AUDIO_RECORDS: 'audio_records'
    }
  }
};

// Gemini AI Service
export class GeminiService {
  static async processAudio(audioFile: File): Promise<{
    name?: string;
    age?: number;
    symptoms?: string;
    possibleCauses?: string;
    lifestyleRecommendations?: string;
    medications?: string;
  }> {
    if (!API_CONFIG.GEMINI.API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    try {
      console.log('Processing audio file:', audioFile.name, audioFile.type);
      
      // For now, we'll simulate the audio processing since Gemini doesn't directly support audio
      // In a real implementation, you'd first convert audio to text using a speech-to-text service
      const prompt = `
        As a medical AI assistant, analyze this patient consultation and extract the following information in JSON format:
        {
          "name": "patient name if mentioned",
          "age": "patient age if mentioned",
          "symptoms": "list of symptoms described",
          "possibleCauses": "possible medical causes",
          "lifestyleRecommendations": "lifestyle recommendations",
          "medications": "suggested medications"
        }
        
        Since this is a demo, please provide sample medical data for a typical patient consultation.
      `;

      const response = await fetch(`${API_CONFIG.GEMINI.ENDPOINT}?key=${API_CONFIG.GEMINI.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      console.log('Gemini API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API response data:', data);
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No response text from Gemini API');
      }
      
      // Try to parse JSON from the response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON from Gemini response:', parseError);
      }
      
      // If parsing fails, return a structured response based on the text
      return {
        name: "John Doe", // Demo data
        age: 35,
        symptoms: "Headache, fatigue, mild fever",
        possibleCauses: "Viral infection, stress, dehydration",
        lifestyleRecommendations: "Get adequate rest, stay hydrated, reduce stress",
        medications: "Acetaminophen for fever, plenty of fluids"
      };
    } catch (error) {
      console.error('Error processing audio with Gemini:', error);
      throw error;
    }
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }
}

// MongoDB Service
export class MongoDBService {
  static async savePrescription(prescription: any): Promise<void> {
    if (!API_CONFIG.MONGODB.CONNECTION_STRING) {
      throw new Error('MongoDB connection string not configured');
    }

    try {
      // This is a placeholder for MongoDB integration
      // You'll need to implement your own backend API endpoint
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescription)
      });

      if (!response.ok) {
        throw new Error('Failed to save prescription');
      }
    } catch (error) {
      console.error('Error saving prescription to MongoDB:', error);
      throw error;
    }
  }

  static async getPrescriptions(patientId?: string): Promise<any[]> {
    try {
      const url = patientId ? `/api/prescriptions?patientId=${patientId}` : '/api/prescriptions';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching prescriptions from MongoDB:', error);
      throw error;
    }
  }
}
