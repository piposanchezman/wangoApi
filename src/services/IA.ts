import { ApiResponse } from "../interfaces/Api"
import { ErrorHandling } from "../middleware/ErrorHandling"

export class ChatGptService {
  static getResponse: (message: string) => Promise<ApiResponse> = async (
    message: string
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${process.env.OPENAI_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      })
      const data = await response.json()
      return {
        code: 200,
        status: "success",
        data: data.choices[0].message.content,
        message: "Response generated from GPT-3.5-turbo model",
      }
    } catch (error) {
      return ErrorHandling.handleError(error)
    }
  }
}
