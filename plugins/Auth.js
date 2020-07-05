export default async (context, inject) => {

    let user = null
    let token = null
    let is_authenticated = false

    // Get Current user here
    let cookieObject = Object.fromEntries(document.cookie.split(/; */).map(c => {
        const [ key, ...v ] = c.split('=');
        return [ key, decodeURIComponent(v.join('=')) ];
    }));

    let response = await context.app.$api.AuthService.CurrentUser(cookieObject.access_token)

    if (response.success) {
        user = response.data
        token = cookieObject.access_token
        is_authenticated = true
        context.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    // Reserve function for logout
    const Logout = async (Form) => {
        document.cookie = `access_token=`
        delete context.$axios.defaults.headers.common['Authorization']
    }

    // Reserve function for login
    const Login = async (Form) => {

        Logout()

        let response = await context.app.$api.AuthService.Login(Form)
        if (!response.success) {
          return response
        }

        // Set current session's token
        document.cookie = `access_token=${response.data.access_token}`
    
        return response
    }

    inject('auth', { user, token, is_authenticated, login: Login, logout: Logout })
}
