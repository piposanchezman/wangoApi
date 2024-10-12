export class UtilsController {
  static getAuthUser = async (userId: string) => {
    try {
      const accessToken = await fetch("https://dev-kllowhtqsd8qirzp.us.auth0.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.AUTH0_CLIENT_ID_MANAGEMENT_CLIENT as string,
          client_secret: process.env.AUT0_CLIENT_SECRET_MANAGEMENT_CLIENT as string,
          audience: "https://dev-kllowhtqsd8qirzp.us.auth0.com/api/v2/",
          grant_type: "client_credentials",
        }),
      })
      const data = await accessToken.json()
      const user = await fetch(`https://dev-kllowhtqsd8qirzp.us.auth0.com/api/v2/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access_token}`,
        },
      })
      const userData = await user.json()
      return {
        code: 200,
        success: true,
        data: userData,
      }
    } catch (error) {
      return {
        succes: false,
        data: error,
      }
    }
  }
}
