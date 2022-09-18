'use strict';
const _ = require('lodash');

const transformRoute = (route, type, name  ) => {
  var [controller, action] = _.get(route, "handler").split(".")
  if (route.handler.includes('::')) {
    // for config on core route
    controller = controller.split('::')[1]
    action = route.handler.split('.').pop();
  }
  return {
    type,
    name,
    controller,
    action,
    roles: route.config.roles,
  }
}

module.exports = ({ strapi }) => ({
  getRoutesWithRolesConfigured() {
    const routes = [];
    // get routes from each API
    for (const apiName in strapi.api) {
      const api = strapi.api[apiName];
      _.forEach(api.routes, router => {
        router.routes.forEach((route) => {
          if (route?.config?.roles) {
            const result = transformRoute(route, 'api', apiName)
            routes.push(result);
          }
        })
      })
    }
    // get routes from each Plugin
    for (const pluginName in strapi.plugins) {
      const plugin = strapi.plugins[pluginName];
      _.forEach(plugin.routes, router => {
        router.routes.forEach((route) => {
          if (route?.config?.roles) {
            const result = transformRoute(route, 'plugin', pluginName)
            routes.push(result);
          }
        })
      })
    }

    return routes;
  }
});
