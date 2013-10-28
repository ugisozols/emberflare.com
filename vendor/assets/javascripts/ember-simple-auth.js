// Version: 0.0.3-103-gd1cdf18
// Last commit: d1cdf18 (2013-10-27 18:14:08 +0100)


(function() {
Ember.SimpleAuth = {};
Ember.SimpleAuth.setup = function(container, application, options) {
  options = options || {};
  this.routeAfterLogin  = options.routeAfterLogin || 'index';
  this.routeAfterLogout = options.routeAfterLogout || 'index';
  this.loginRoute       = options.loginRoute || 'login';
  this.serverTokenRoute = options.serverTokenRoute || '/token';
  this.autoRefreshToken = Ember.isEmpty(options.autoRefreshToken) ? true : !!options.autoRefreshToken;

  var session = Ember.SimpleAuth.Session.create();
  application.register('simple_auth:session', session, { instantiate: false, singleton: true });
  Ember.$.each(['model', 'controller', 'view', 'route'], function(i, component) {
    application.inject(component, 'session', 'simple_auth:session');
  });

  Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (!jqXHR.crossDomain && !Ember.isEmpty(session.get('authToken'))) {
      jqXHR.setRequestHeader('Authorization', 'Bearer ' + session.get('authToken'));
    }
  });

  this.externalLoginSucceeded = function(sessionData) {
    session.setup(sessionData);
    container.lookup('route:application').send('loginSucceeded');
  };
  this.externalLoginFailed = function(error) {
    container.lookup('route:application').send('loginFailed', error);
  };
};

})();



(function() {
Ember.SimpleAuth.Session = Ember.Object.extend({
  init: function() {
    this._super();
    this.setProperties({
      authToken:       sessionStorage.authToken,
      refreshToken:    sessionStorage.refreshToken,
      authTokenExpiry: sessionStorage.authTokenExpiry
    });
    this.handleAuthTokenRefresh();
  },

  setup: function(data) {
    data = data || {};
    this.setProperties({
      authToken:       data.access_token,
      refreshToken:    (data.refresh_token || this.get('refreshToken')),
      authTokenExpiry: (data.expires_in > 0 ? data.expires_in * 1000 : this.get('authTokenExpiry')) || 0
    });
  },

  destroy: function() {
    this.setProperties({
      authToken:       undefined,
      refreshToken:    undefined,
      authTokenExpiry: undefined
    });
  },

  isAuthenticated: Ember.computed('authToken', function() {
    return !Ember.isEmpty(this.get('authToken'));
  }),

  handlePropertyChange: function(property) {
    var value = this.get(property);
    if (Ember.isEmpty(value)) {
      delete sessionStorage[property];
    } else {
      sessionStorage[property] = value;
    }
  },

  authTokenObserver: Ember.observer(function() {
    this.handlePropertyChange('authToken');
  }, 'authToken'),

  refreshTokenObserver: Ember.observer(function() {
    this.handlePropertyChange('refreshToken');
    this.handleAuthTokenRefresh();
  }, 'refreshToken'),

  authTokenExpiryObserver: Ember.observer(function() {
    this.handlePropertyChange('authTokenExpiry');
    this.handleAuthTokenRefresh();
  }, 'authTokenExpiry'),

  handleAuthTokenRefresh: function() {
    if (Ember.SimpleAuth.autoRefreshToken) {
      Ember.run.cancel(this.get('refreshAuthTokenTimeout'));
      this.set('refreshAuthTokenTimeout', undefined);
      var waitTime = this.get('authTokenExpiry') - 5000;
      if (!Ember.isEmpty(this.get('refreshToken')) && waitTime > 0) {
        this.set('refreshAuthTokenTimeout', Ember.run.later(this, function() {
          var self = this;
          Ember.$.ajax(Ember.SimpleAuth.serverTokenRoute, {
            type:        'POST',
            data:        'grant_type=refresh_token&refresh_token=' + this.get('refreshToken'),
            contentType: 'application/x-www-form-urlencoded'
          }).then(function(response) {
            self.setup(response);
            self.handleAuthTokenRefresh();
          });
        }, waitTime));
      }
    }
  }
});

})();



(function() {
Ember.SimpleAuth.AuthenticatedRouteMixin = Ember.Mixin.create({
  beforeModel: function(transition) {
    if (!this.get('session.isAuthenticated')) {
      transition.abort();
      this.triggerLogin(transition);
    }
  },

  triggerLogin: function(transition) {
    this.set('session.attemptedTransition', transition);
    this.send('login');
  }
});

})();



(function() {
Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create({
  tokenRequestOptions: function(username, password) {
    var postData = ['grant_type=password', 'username=' + username, 'password=' + password].join('&');
    return { type: 'POST', data: postData, contentType: 'application/x-www-form-urlencoded' };
  },
  actions: {
    login: function() {
      var self = this;
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        var requestOptions = this.tokenRequestOptions(data.identification, data.password);
        Ember.$.ajax(Ember.SimpleAuth.serverTokenRoute, requestOptions).then(function(response) {
          self.get('session').setup(response);
          self.send('loginSucceeded');
        }, function(xhr, status, error) {
          self.send('loginFailed', xhr, status, error);
        });
      }
    }
  }
});

})();



(function() {
Ember.SimpleAuth.ApplicationRouteMixin = Ember.Mixin.create({
  actions: {
    login: function() {
      this.transitionTo(Ember.SimpleAuth.loginRoute);
    },

    loginSucceeded: function() {
      var attemptedTransition = this.get('session.attemptedTransition');
      if (attemptedTransition) {
        attemptedTransition.retry();
        this.set('session.attemptedTransition', undefined);
      } else {
        this.transitionTo(Ember.SimpleAuth.routeAfterLogin);
      }
    },

    loginFailed: function() {
    },

    logout: function() {
      this.get('session').destroy();
      this.transitionTo(Ember.SimpleAuth.routeAfterLogout);
    }
  }
});

})();



(function() {

})();

