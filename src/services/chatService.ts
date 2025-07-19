
export interface ChatResponse {
  message: string;
  options?: string[];
  action?: string;
  data?: any;
}

class ChatService {
  private baseUrl: string;

  constructor() {
    // Replace with your actual Python backend URL
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  }

  async sendMessage(message: string, isOption: boolean = false): Promise<ChatResponse> {
    try {
      console.log('Sending message to backend:', { message, isOption });
      
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          isOption,
          timestamp: new Date().toISOString(),
          sessionId: this.getSessionId(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      console.log('Backend response:', data);
      
      return data;
    } catch (error) {
      console.error('Error calling backend:', error);
      
      // Fallback response for demo/development
      return this.getFallbackResponse(message, isOption);
    }
  }

  private getFallbackResponse(message: string, isOption: boolean): ChatResponse {
    // Demo responses based on message content
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('doctor') || lowerMessage === 'talk with doctor') {
      return {
        message: "I'll connect you with our medical team. What symptoms or concerns would you like to discuss?",
        options: [
          "I have a fever and headache",
          "I need a prescription refill",
          "I have questions about my medication",
          "I want to discuss test results"
        ]
      };
    }
    
    if (lowerMessage.includes('appointment') || lowerMessage === 'book appointment') {
      return {
        message: "I'd be happy to help you schedule an appointment. What type of appointment do you need?",
        options: [
          "General check-up",
          "Specialist consultation",
          "Follow-up appointment",
          "Urgent care visit"
        ]
      };
    }
    
    if (lowerMessage.includes('fever')) {
      return {
        message: "I understand you're experiencing fever and headache. How long have you had these symptoms, and have you taken your temperature?",
        options: [
          "Less than 24 hours",
          "1-3 days",
          "More than 3 days",
          "I haven't taken my temperature"
        ]
      };
    }
    
    if (lowerMessage.includes('prescription')) {
      return {
        message: "For prescription refills, I'll need some information. What medication do you need refilled?",
        options: [
          "Blood pressure medication",
          "Diabetes medication",
          "Pain medication",
          "Other medication"
        ]
      };
    }
    
    // Default response
    return {
      message: "Thank you for your message. Our medical team will review your concern and provide appropriate guidance. Is there anything specific you'd like to know more about?",
      options: [
        "Tell me about your services",
        "How can I schedule an appointment?",
        "What are your operating hours?",
        "I need emergency assistance"
      ]
    };
  }

  private getSessionId(): string {
    let sessionId = localStorage.getItem('chatSessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chatSessionId', sessionId);
    }
    return sessionId;
  }

  // Method to send appointment booking data
  async bookAppointment(appointmentData: any): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...appointmentData,
          sessionId: this.getSessionId(),
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error booking appointment:', error);
      return {
        message: "I apologize, but there was an issue booking your appointment. Please try again or contact us directly."
      };
    }
  }

  // Method to send doctor consultation request
  async requestDoctorConsultation(consultationData: any): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...consultationData,
          sessionId: this.getSessionId(),
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error requesting consultation:', error);
      return {
        message: "I apologize, but there was an issue processing your consultation request. Please try again or contact us directly."
      };
    }
  }
}

export const chatService = new ChatService();
