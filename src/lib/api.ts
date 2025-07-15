
// API Configuration File
// This is where you'll add your API keys and endpoints

export const API_CONFIG = {
  // Gemini AI Configuration
  GEMINI: {
    API_KEY: '', // Paste your Gemini API key here
    ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
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
      // Convert audio to base64
      const audioBase64 = await this.fileToBase64(audioFile);
      
      const prompt = `
        Analyze this medical consultation audio and extract the following information in JSON format:
        - Patient name
        - Patient age
        - Symptoms described
        - Possible causes
        - Lifestyle recommendations
        - Suggested medications
        
        Please provide a structured response with these fields.
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
            }, {
              inline_data: {
                mime_type: audioFile.type,
                data: audioBase64
              }
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process audio with Gemini');
      }

      const data = await response.json();
      const text = data.candidates[0]?.content?.parts[0]?.text;
      
      // Parse the JSON response from Gemini
      try {
        return JSON.parse(text);
      } catch {
        // If parsing fails, return a structured response
        return {
          symptoms: "Audio processed successfully",
          possibleCauses: "Please review the audio manually",
          lifestyleRecommendations: "Follow general health guidelines",
          medications: "Consult with patient directly"
        };
      }
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
