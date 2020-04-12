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
        context.$axios.defaults.headers.common['Authorization'] = token
    }


    // Reserve function for login
    const Login = async (Form) => {

        try {
            document.cookie = `access_token=`
            delete context.$axios.defaults.headers.common['Authorization']
        } catch (error) {
            return { success: false, error: 'Failed to clear session' }
        }

        let response = await context.app.$api.AuthService.Login(Form)
        if (!response.success) {
          return response
        }

        // Set current session's token
        document.cookie = `access_token=${response.data.access_token}`
    
        return response
    }

    inject('auth', { user, token, is_authenticated, login: Login })
}
