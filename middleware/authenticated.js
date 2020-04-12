export default function ({ store, route, redirect, app }) {

    // Accessing other page other than login
    // when user is not authenticated
    if (!app.$auth.is_authenticated && route.name != 'login') {
      redirect('/login')
    }
    // Accessing login page
    // when user was already authenticated
    else if (app.$auth.is_authenticated && route.name == 'login') {
      redirect('/')
    }
  }
  