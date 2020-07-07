
function NotAuthenticated (app, route) {
  return !app.$auth.is_authenticated && route.name != 'login'
}
function GoingToLoginPage (app, route) {
  return app.$auth.is_authenticated && route.name == 'login'
}
function AccessToPageForbidden (app, route) {
  const currentUser = app.$auth.user
  if (!currentUser) return
  let isSuperuser = currentUser.is_superuser
  let isAdministrator = currentUser.application.is_administrator
  let permissions = currentUser.application.web_urls
  // List of:
  // {
  //     "code": "RTF-5",
  //     "url": "/applications/:id/delete"
  // }
  let currentPath = route.matched[0].path

  currentPath = currentPath.endsWith("?") ? currentPath.substring(0,currentPath.length-1) : currentPath

  if (currentPath == "") return

  if (!isSuperuser && !isAdministrator) {

    if (permissions && permissions.length > 0) {

      let allowedRoutes = permissions.map(item => item.url)

      if (!allowedRoutes.includes(currentPath)) {

        return true
      }
    }
  }
}

export default function ({ store, route, redirect, app }) {
  if (NotAuthenticated(app, route))
    redirect('/login')

  if (GoingToLoginPage(app, route))
    redirect('/')

  if (AccessToPageForbidden(app, route))
    throw { statusCode: 403 }
}
  