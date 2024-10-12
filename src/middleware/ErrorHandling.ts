export class ErrorHandling {
  static async handleError(error: any) {
    return {
      code: 500,
      status: "error",
      message: error.message,
    }
  }
}
