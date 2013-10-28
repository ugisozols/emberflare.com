// Version: 0.0.2-6-g48729a9
// Last commit: 48729a9 (2013-10-12 10:40:11 +0200)


(function() {
Ember.SimpleAuth = {};
Ember.SimpleAuth.setup = function(app, options) {
  options = options || {};
  this.routeAfterLogin = options.routeAfterLogin || 'index';
  this.routeAfterLogout = options.routeAfterLogout || 'index';
  this.loginRoute = options.loginRoute || 'login';
  this.logoutRoute = options.logoutRoute || 'logout';
  this.serverSessionRoute = options.serverSessionRoute || '/session';

  var session = Ember.SimpleAuth.Session.create();
  app.register('simple_auth:session', session, { instantiate: false, singleton: true });
  Ember.$.each(['model', 'controller', 'view', 'route'], function(i, component) {
    app.inject(component, 'session', 'simple_auth:session');
  });

  Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (!jqXHR.crossDomain && !Ember.isEmpty(session.get('authToken'))) {
      jqXHR.setRequestHeader('Authorization', 'Token token="' + session.get('authToken') + '"');
    }
  });
};

})();



(function() {
Ember.SimpleAuth.Session = Ember.Object.extend({
  init: function() {
    this._super();
    this.set('authToken', sessionStorage.authToken);
  },
  setup: function(serverSession) {
    this.set('authToken', (serverSession.session || {}).authToken);
  },
  destroy: function() {
    this.set('authToken', undefined);
  },
  isAuthenticated: Ember.computed('authToken', function() {
    return !Ember.isEmpty(this.get('authToken'));
  }),
  authTokenObserver: Ember.observer(function() {
    var authToken = this.get('authToken');
    if (Ember.isEmpty(authToken)) {
      delete sessionStorage.authToken;
    } else {
      sessionStorage.authToken = this.get('authToken');
    }
  }, 'authToken')
});

})();



(function() {
Ember.SimpleAuth.AuthenticatedRouteMixin = Ember.Mixin.create({
  beforeModel: function(transition) {
    if (!this.get('session.isAuthenticated')) {
      this.redirectToLogin(transition);
    }
  },
  redirectToLogin: function(transition) {
    this.set('session.attemptedTransition', transition);
    this.transitionTo(Ember.SimpleAuth.loginRoute);
  }
});

})();



(function() {
Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create({
  serializeCredentials: function(identification, password) {
    return { session: { identification: identification, password: password } };
  },
  actions: {
    login: function() {
      var self = this;
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        var postData = JSON.stringify(self.serializeCredentials(data.identification, data.password));
        Ember.$.ajax(Ember.SimpleAuth.serverSessionRoute, {
          type:        'POST',
          data:        postData,
          contentType: 'application/json'
        }).then(function(response) {
          self.get('session').setup(response);
          var attemptedTransition = self.get('session.attemptedTransition');
          if (attemptedTransition) {
            attemptedTransition.retry();
            self.set('session.attemptedTransition', null);
          } else {
            self.transitionToRoute(Ember.SimpleAuth.routeAfterLogin);
          }
        }, function() {
          Ember.tryInvoke(self, 'loginFailed', arguments);
        });
      }
    }
  }
});

})();



(function() {
Ember.SimpleAuth.LogoutRouteMixin = Ember.Mixin.create({
  beforeModel: function() {
    var self = this;
    Ember.$.ajax(Ember.SimpleAuth.serverSessionRoute, { type: 'DELETE' }).always(function(response) {
      self.get('session').destroy();
      self.transitionTo(Ember.SimpleAuth.routeAfterLogout);
    });
  }
});

})();



(function() {

})();

