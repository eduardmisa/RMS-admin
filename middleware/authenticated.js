
function NotAuthenticated (app, route) {
  return !app.$auth.is_authenticated && route.name != 'login'
}
function GoingToLoginPage (app, route) {
  return app.$auth.is_authenticated && route.name == 'login'
}
function AccessToPageForbidden (app, route) {
  const currentUser = app.$auth.user
  // {
  //   client_id: 3
  //   name: "Resource Management System"
  //   description: ""
  //   is_administrator: false
  //   permissions: []
  //   external_permissions: []
  // }
  let currentApplication = currentUser.application
  let isSuperuser = currentUser.is_superuser
  let isAdministrator = currentUser.application.is_administrator
  let permissions = currentUser.application.permissions
  // {
  //   parent_module_name: "Applications"
  //   parent_module_code: "MOD-10"
  //   parent_module_front_icon: "mdi-cloud-tags"
  //   parent_module_front_url: ""
  //   module_code: "MOD-13"
  //   module_name: "List Application"
  //   module_front_icon: ""
  //   module_front_url: "/applications/"
  //   permission: "Can View Applications"
  //   method: "GET"
  //   url: "/api/v1/management/applications/[0-9]+/"
  // }
  let currentPath = route.path
  // "/modules/"

  if (!isSuperuser && !isAdministrator) {

    if (permissions && permissions.length > 0) {

      let allowedRoutes = permissions.map(item => item.module_front_url)

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
  