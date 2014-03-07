 // Version: 0.1.3

(function() {
'use strict';

function extractLocationOrigin(location) {
  if (Ember.typeOf(location) === 'string') {
    var link = document.createElement('a');
    link.href = location;
    //IE requires the following line when url is relative.
    //First assignment of relative url to link.href results in absolute url on link.href but link.hostname and other properties are not set
    //Second assignment of absolute url to link.href results in link.hostname and other properties being set as expected
    link.href = link.href;
    location = link;
  }
  var port = location.port;
  if (Ember.isEmpty(port)) {
    //need to include the port whether its actually present or not as some versions of IE will always set it
    port = location.protocol === 'http:' ? '80' : (location.protocol === 'https:' ? '443' : '');
  }
  return location.protocol + '//' + location.hostname + (port !== '' ? ':' + port : '');
}

/**
  The main namespace for Ember.SimpleAuth.

  __For a general overview of how Ember.SimpleAuth works, see the
  [README](https://github.com/simplabs/ember-simple-auth#readme).__

  @class SimpleAuth
  @namespace Ember
**/
Ember.SimpleAuth = Ember.Namespace.create({
  Authenticators: Ember.Namespace.create(),
  Authorizers:    Ember.Namespace.create(),
  Stores:         Ember.Namespace.create(),

  /**
    The route to transition to for authentication; can be set through
    [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property authenticationRoute
    @readOnly
    @static
    @type String
    @default 'login'
  */
  authenticationRoute: 'login',
  /**
    The route to transition to after successful authentication; can be set
    through [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property routeAfterAuthentication
    @readOnly
    @static
    @type String
    @default 'index'
  */
  routeAfterAuthentication: 'index',
  /**
    The route to transition to after session invalidation; can be set through
    [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

    @property routeAfterInvalidation
    @readOnly
    @static
    @type String
    @default 'index'
  */
  routeAfterInvalidation: 'index',

  /**
    Sets up Ember.SimpleAuth for the application; this method __should be invoked in a custom
    initializer__ like this:

    ```javascript
    Ember.Application.initializer({
      name: 'authentication',
      initialize: function(container, application) {
        Ember.SimpleAuth.setup(container, application);
      }
    });
    ```

    @method setup
    @static
    @param {Container} container The Ember.js application's dependency injection container
    @param {Ember.Application} application The Ember.js application instance
    @param {Object} [options]
      @param {String} [options.authenticationRoute] route to transition to for authentication - defaults to `'login'`
      @param {String} [options.routeAfterAuthentication] route to transition to after successful authentication - defaults to `'index'`
      @param {String} [options.routeAfterInvalidation] route to transition to after session invalidation - defaults to `'index'`
      @param {Array[String]} [options.crossOriginWhitelist] Ember.SimpleAuth will never authorize requests going to a different origin than the one the Ember.js application was loaded from; to explicitely enable authorization for additional origins, whitelist those origins - defaults to `[]` _(beware that origins consist of protocol, host and port (port can be left out when it is 80))_
      @param {Object} [options.authorizer] The authorizer _class_ to use; must extend `Ember.SimpleAuth.Authorizers.Base` - defaults to `Ember.SimpleAuth.Authorizers.OAuth2`
      @param {Object} [options.store] The store _class_ to use; must extend `Ember.SimpleAuth.Stores.Base` - defaults to `Ember.SimpleAuth.Stores.LocalStorage`
  **/
  setup: function(container, application, options) {
    options                       = options || {};
    this.routeAfterAuthentication = options.routeAfterAuthentication || this.routeAfterAuthentication;
    this.routeAfterInvalidation   = options.routeAfterInvalidation || this.routeAfterInvalidation;
    this.authenticationRoute      = options.authenticationRoute || this.authenticationRoute;
    this._crossOriginWhitelist    = Ember.A(options.crossOriginWhitelist || []).map(function(origin) {
      return extractLocationOrigin(origin);
    });

    container.register('ember-simple-auth:authenticators:oauth2', Ember.SimpleAuth.Authenticators.OAuth2);

    var store      = (options.store || Ember.SimpleAuth.Stores.LocalStorage).create();
    var session    = Ember.SimpleAuth.Session.create({ store: store, container: container });
    var authorizer = (options.authorizer || Ember.SimpleAuth.Authorizers.OAuth2).create({ session: session });

    container.register('ember-simple-auth:session:current', session, { instantiate: false });
    Ember.A(['model', 'controller', 'view', 'route']).forEach(function(component) {
      container.injection(component, 'session', 'ember-simple-auth:session:current');
    });

    Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
      if (Ember.SimpleAuth.shouldAuthorizeRequest(options.url)) {
        authorizer.authorize(jqXHR, options);
      }
    });
  },

  /**
    @method shouldAuthorizeRequest
    @private
    @static
  */
  shouldAuthorizeRequest: function(url) {
    this._urlOrigins     = this._urlOrigins || {};
    this._documentOrigin = this._documentOrigin || extractLocationOrigin(window.location);
    var urlOrigin        = this._urlOrigins[url] = this._urlOrigins[url] || extractLocationOrigin(url);
    return this._crossOriginWhitelist.indexOf(urlOrigin) > -1 || urlOrigin === this._documentOrigin;
  }
});

})();



(function() {
'use strict';

/**
  __The session provides access to the current authentication state as well as
  any properties resolved by the authenticator__ (see
  [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)).
  It is created when Ember.SimpleAuth is set up (see
  [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)) and __injected into all
  models, controllers, routes and views so that all parts of the application
  can always access the current authentication state and other properties__,
  depending on the used authenticator (see
  [Ember.SimpleAuth.Authenticators.Base](#Ember-SimpleAuth-Authenticators-Base))).

  The session also provides methods to authenticate the user and to invalidate
  itself (see
  [Ember.SimpleAuth.Session#authenticate](#Ember-SimpleAuth-Session-authenticate),
  [Ember.SimpleAuth.Session#invaldiate](#Ember-SimpleAuth-Session-invaldiate)
  These methods are usually invoked through actions from routes or controllers.

  @class Session
  @namespace Ember.SimpleAuth
  @extends Ember.ObjectProxy
*/
Ember.SimpleAuth.Session = Ember.ObjectProxy.extend({
  /**
    The authenticator factory used to authenticate the session. This is only
    set when the session is currently authenticated.

    @property authenticator
    @type String
    @readOnly
    @default null
  */
  authenticatorFactory: null,
  /**
    The store used to persist session properties. This is assigned during
    Ember.SimpleAuth's setup and can be specified there
    (see [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)).

    @property store
    @type Ember.SimpleAuth.Stores.Base
    @readOnly
    @default null
  */
  store: null,
  /**
    Returns whether the session is currently authenticated.

    @property isAuthenticated
    @type Boolean
    @readOnly
    @default false
  */
  isAuthenticated: false,
  /**
    @property attemptedTransition
    @private
  */
  attemptedTransition: null,
  /**
    @property content
    @private
  */
  content: null,

  /**
    @method init
    @private
  */
  init: function() {
    var _this = this;
    this.bindToStoreEvents();
    var restoredContent      = this.store.restore();
    var authenticatorFactory = restoredContent.authenticatorFactory;
    if (!!authenticatorFactory) {
      delete restoredContent.authenticatorFactory;
      this.container.lookup(authenticatorFactory).restore(restoredContent).then(function(content) {
        _this.setup(authenticatorFactory, content);
      }, function() {
        _this.store.clear();
      });
    } else {
      this.store.clear();
    }
  },

  /**
    Authentices the session with an `authenticator` and appropriate `options`.
    __This delegates the actual authentication work to the `authenticator`__
    and handles the returned promise accordingly (see
    [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)).

    __This method returns a promise itself. A resolving promise indicates that
    the session was successfully authenticated__ while a rejecting promise
    indicates that authentication failed and the session remains
    unauthenticated.

    @method authenticate
    @param {String} authenticatorFactory The authenticator factory to use as it is registered with Ember's container, see [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register)
    @param {Object} options The options to pass to the authenticator; depending on the type of authenticator these might be a set of credentials etc.
    @return {Ember.RSVP.Promise} A promise that resolves when the session was authenticated successfully
  */
  authenticate: function(authenticatorFactory, options) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      _this.container.lookup(authenticatorFactory).authenticate(options).then(function(content) {
        _this.setup(authenticatorFactory, content);
        resolve();
      }, function(error) {
        _this.clear();
        reject(error);
      });
    });
  },

  /**
    Invalidates the session with the current `authenticator`. __This invokes
    the `authenticator`'s `invalidate` hook and handles the returned promise
    accordingly__ (see
    [Ember.SimpleAuth.Authenticators.Base#invalidate](#Ember-SimpleAuth-Authenticators-Base-invalidate)).

    __This method returns a promise itself. A resolving promise indicates that
    the session was successfully invalidated__ while a rejecting promise
    indicates that the promise returned by the `authenticator` rejected and
    thus invalidation was cancelled. In that case the session remains
    authenticated.

    @method invalidate
    @return {Ember.RSVP.Promise} A promise that resolves when the session was invalidated successfully
  */
  invalidate: function() {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var authenticator = _this.container.lookup(_this.authenticatorFactory);
      authenticator.invalidate(_this.content).then(function() {
        authenticator.off('ember-simple-auth:session-updated');
        _this.clear();
        resolve();
      }, function(error) {
        reject(error);
      });
    });
  },

  /**
    @method setup
    @private
  */
  setup: function(authenticatorFactory, content) {
    this.setProperties({
      isAuthenticated:   true,
      authenticatorFactory: authenticatorFactory,
      content:           content
    });
    this.bindToAuthenticatorEvents();
    var data = Ember.$.extend({ authenticatorFactory: authenticatorFactory }, this.content);
    this.store.clear();
    this.store.persist(data);
  },

  /**
    @method clear
    @private
  */
  clear: function() {
    this.setProperties({
      isAuthenticated:   false,
      authenticatorFactory: null,
      content:           null
    });
    this.store.clear();
  },

  /**
    @method bindToAuthenticatorEvents
    @private
  */
  bindToAuthenticatorEvents: function() {
    var _this = this;
    var authenticator = this.container.lookup(this.authenticatorFactory);
    authenticator.off('ember-simple-auth:session-updated');
    authenticator.on('ember-simple-auth:session-updated', function(content) {
      _this.setup(_this.authenticatorFactory, content);
    });
  },

  /**
    @method bindToStoreEvents
    @private
  */
  bindToStoreEvents: function() {
    var _this = this;
    this.store.on('ember-simple-auth:session-updated', function(content) {
      var authenticatorFactory = content.authenticatorFactory;
      if (!!authenticatorFactory) {
        delete content.authenticatorFactory;
        _this.container.lookup(authenticatorFactory).restore(content).then(function(content) {
          _this.setup(authenticatorFactory, content);
        }, function() {
          _this.clear();
        });
      } else {
        _this.clear();
      }
    });
  }
});

})();



(function() {
'use strict';

/**
  The base for all authorizers. __This serves as a starting point for
  implementing custom authorizers and must not be used directly.__

  __The authorizer preprocesses all XHR requests__ (expect ones to 3rd party
  origins, see [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)) and makes
  sure they have the required data attached that allows the server to identify
  the user making the request. This data might be a specific header, data in
  the query part of the URL, cookies etc. __The authorizer has to fit the
  authenticator__ (see
  [Ember.SimpleAuth.Authenticators.Base](#Ember-SimpleAuth-Authenticators-Base))
  as it usually relies on data that the authenticator retrieves during
  authentication and that it makes available through the session.

  @class Base
  @namespace Ember.SimpleAuth.Authorizers
  @extends Ember.Object
*/
Ember.SimpleAuth.Authorizers.Base = Ember.Object.extend({
  /**
    The session the authorizer gets the data it needs to authorize requests
    from (see [Ember.SimpleAuth.Session](#Ember-SimpleAuth-Session)).

    @property session
    @readOnly
    @type Ember.SimpleAuth.Session
    @default null
  */
  session: null,

  /**
    Authorizes an XHR request by adding some sort of secret information that
    allows the server to identify the user making the request (e.g. a token in
    the `Authorization` header or some other secret in the query string etc.).

    `Ember.SimpleAuth.Authorizers.Base`'s implementation does nothing as
    there's no reasonable default behavior (for Ember.SimpleAuth's default
    authorizer see
    [Ember.SimpleAuth.Authorizers.OAuth2](#Ember-SimpleAuth-Authorizers-OAuth2)).

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */
  authorize: function(jqXHR, requestOptions) {
  }
});

})();



(function() {
'use strict';

/**
  Authorizer that conforms to OAuth 2
  ([RFC 6749](http://tools.ietf.org/html/rfc6749)) by adding bearer tokens
  ([RFC 6749](http://tools.ietf.org/html/rfc6750)).

  @class OAuth2
  @namespace Ember.SimpleAuth.Authorizers
  @extends Ember.SimpleAuth.Authorizers.Base
*/
Ember.SimpleAuth.Authorizers.OAuth2 = Ember.SimpleAuth.Authorizers.Base.extend({
  /**
    Authorizes an XHR request by adding the `access_token` property from the
    session as a bearer token in the `Authorization` header:

    ```
    Authorization: Bearer <token>
    ```

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */
  authorize: function(jqXHR, requestOptions) {
    if (!Ember.isEmpty(this.get('session.access_token'))) {
      jqXHR.setRequestHeader('Authorization', 'Bearer ' + this.get('session.access_token'));
    }
  }
});

})();



(function() {
'use strict';

/**
  The base for all authenticators. __This serves as a starting point for
  implementing custom authenticators and must not be used directly.__

  The authenticator acquires all data that makes up the session. The actual
  mechanism used to do this might e.g. be posting a set of credentials to a
  server and in exchange retrieving an access token, initiating authentication
  against an external provider like Facebook etc. and depends on the specific
  authenticator. Any data that the authenticator receives upon successful
  authentication is stored in the session and can then be used by the
  authorizer (see
  [Ember.SimpleAuth.Authorizers.Base](#Ember-SimpleAuth-Authorizers-Base)).

  Authenticators may trigger the `'ember-simple-auth:session-updated'` event
  when any of the session properties change. The session listens to that event
  and will handle the changes accordingly.

  __Custom authenticators have to be registered with Ember's dependency
  injection container__ so that the session can retrieve an instance, e.g.:

  ```javascript
  var CustomAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
    ...
  });
  Ember.Application.initializer({
    name: 'authentication',
    initialize: function(container, application) {
      container.register('app:authenticators:custom', CustomAuthenticator);
      Ember.SimpleAuth.setup(container, application);
    }
  });
  ```

  @class Base
  @namespace Ember.SimpleAuth.Authenticators
  @extends Ember.Object
  @uses Ember.Evented
*/
Ember.SimpleAuth.Authenticators.Base = Ember.Object.extend(Ember.Evented, {
  /**
    Restores the session from a set of properties. __This method is invoked by
    the session either after the applciation starts up and session properties
    where restored from the store__ or when properties in the store have
    changed due to external events (e.g. in another tab).

    __This method returns a promise. A resolving promise will result in the
    session being authenticated.__ Any properties the promise resolves with
    will be saved by and accessible via the session. In most cases the
    `properties` argument will simply be forwarded through the promise. A
    rejecting promise indicates that authentication failed and the session
    will remain unchanged.

    `Ember.SimpleAuth.Authenticators.Base`'s always rejects as there's no
    reasonable default implementation.

    @method restore
    @param {Object} properties The properties to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(properties) {
    return new Ember.RSVP.Promise(function(resolve, reject) { reject(); });
  },

  /**
    Authenticates the session with the specified `options`. These options vary
    depending on the actual authentication mechanism the authenticator uses
    (e.g. a set of credentials or a Facebook account id etc.). __The session
    will invoke this method when an action in the appliaction triggers
    authentication__ (see
    [Ember.SimpleAuth.AuthenticationControllerMixin.actions#authenticate](#Ember-SimpleAuth-AuthenticationControllerMixin-authenticate)).

    __This method returns a promise. A resolving promise will result in the
    session being authenticated.__ Any properties the promise resolves with
    will be saved by and accessible via the session. A rejecting promise
    indicates that authentication failed and the session will remain unchanged.

    `Ember.SimpleAuth.Authenticators.Base`'s implementation always returns a
    rejecting promise and thus never authenticates the session as there's no
    reasonable default behavior (for Ember.SimpleAuth's default authenticator
    see
    [Ember.SimpleAuth.Authenticators.OAuth2](#Ember-SimpleAuth-Authenticators-OAuth2)).

    @method authenticate
    @param {Object} options The options to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  authenticate: function(options) {
    return new Ember.RSVP.Promise(function(resolve, reject) { reject(); });
  },

  /**
    Invalidation callback that is invoked when the session is invalidated.
    While the session will invalidate itself and clear all session properties,
    it might be necessary for some authenticators to perform additional tasks
    (e.g. invalidating an access token on the server), which should be done in
    this method.

    __This method returns a promise. A resolving promise will result in the
    session being invalidated.__ A rejecting promise will result in the session
    invalidation being intercepted and the session being left authenticated.

    `Ember.SimpleAuth.Authenticators.Base`'s implementation always returns a
    resolving promise and thus always invalidates the session without doing
    anything.

    @method invalidate
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
  */
  invalidate: function() {
    return new Ember.RSVP.Promise(function(resolve) { resolve(); });
  }
});

})();



(function() {
'use strict';

/**
  Authenticator that conforms to OAuth 2
  ([RFC 6749](http://tools.ietf.org/html/rfc6749)), specifically the _"Resource
  Owner Password Credentials Grant Type"_.

  This authenticator supports refreshing the access token automatically and
  will trigger the `'ember-simple-auth:session-updated'` event each time the
  token was refreshed.

  @class OAuth2
  @namespace Ember.SimpleAuth.Authenticators
  @extends Ember.SimpleAuth.Authenticators.Base
*/
Ember.SimpleAuth.Authenticators.OAuth2 = Ember.SimpleAuth.Authenticators.Base.extend({
  /**
    The endpoint on the server the authenticator acquires the access token
    from.

    @property serverTokenEndpoint
    @type String
    @default '/token'
  */
  serverTokenEndpoint: '/token',
  /**
    Sets whether the authenticator automatically refreshes access tokens.

    @property refreshAccessTokens
    @type Boolean
    @default true
  */
  refreshAccessTokens: true,
  /**
    @property _refreshTokenTimeout
    @private
  */
  _refreshTokenTimeout: null,

  /**
    Restores the session from a set of session properties; __will return a
    resolving promise when there's a non-empty `access_token` in the
    `properties`__ and a rejecting promise otherwise.

    This method also schedules automatic token refreshing when there are values
    for `refresh_token` and `expires_in` in the `properties` and automatic
    token refreshing isn't disabled (see
    [Ember.SimpleAuth.Authenticators.OAuth2#refreshAccessTokens](#Ember-SimpleAuth-Authenticators-OAuth2-refreshAccessTokens)).

    @method restore
    @param {Object} properties The properties to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
  */
  restore: function(properties) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.access_token)) {
        _this.scheduleAccessTokenRefresh(properties.expires_in, properties.expires_at, properties.refresh_token);
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  /**
    Authenticates the session with the specified `credentials`; the credentials
    are `POST`ed to the `serverTokenEndpoint` and if they are valid the server
    returns an access token in response (see
    http://tools.ietf.org/html/rfc6749#section-4.3). __If the credentials are
    valid and authentication succeeds, a promise that resolves with the
    server's response is returned__, otherwise a promise that rejects with the
    error is returned.

    This method also schedules automatic token refreshing when there are values
    for `refresh_token` and `expires_in` in the server response and automatic
    token refreshing isn't disabled (see
    [Ember.SimpleAuth.Authenticators.OAuth2#refreshAccessTokens](#Ember-SimpleAuth-Authenticators-OAuth2-refreshAccessTokens)).

    @method authenticate
    @param {Object} options The credentials to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that resolves when an access token is successfully acquired from the server and rejects otherwise
  */
  authenticate: function(credentials) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var data = { grant_type: 'password', username: credentials.identification, password: credentials.password };
      _this.makeRequest(data).then(function(response) {
        Ember.run(function() {
          var expiresAt = _this.absolutizeExpirationTime(response.expires_in);
          _this.scheduleAccessTokenRefresh(response.expires_in, expiresAt, response.refresh_token);
          resolve(Ember.$.extend(response, { expires_at: expiresAt }));
        });
      }, function(xhr, status, error) {
        Ember.run(function() {
          reject(xhr.responseText);
        });
      });
    });
  },

  /**
    Cancels any outstanding automatic token refreshes.

    @method invalidate
    @return {Ember.RSVP.Promise} A resolving promise
  */
  invalidate: function() {
    Ember.run.cancel(this._refreshTokenTimeout);
    delete this._refreshTokenTimeout;
    return new Ember.RSVP.Promise(function(resolve) { resolve(); });
  },

  /**
    Sends an `AJAX` request to the `serverTokenEndpoint`. This will always be a
    _"POST_" request with content type _"application/x-www-form-urlencoded"_ as
    specified in [RFC 6749](http://tools.ietf.org/html/rfc6749).

    This method is not meant to be used directly but serves as an extension
    point to e.g. add _"Client Credentials"_ (see
    [RFC 6749, section 2.3](http://tools.ietf.org/html/rfc6749#section-2.3)).

    @method makeRequest
    @param {Object} data The data to send with the request, e.g. username and password or the refresh token
    @return {Deferred object} A Deferred object (see [the jQuery docs](http://api.jquery.com/category/deferred-object/)) that is compatible to Ember.RSVP.Promise; will resolve if the request succeeds, reject otherwise
    @protected
  */
  makeRequest: function(data) {
    return Ember.$.ajax({
      url:         this.serverTokenEndpoint,
      type:        'POST',
      data:        data,
      dataType:    'json',
      contentType: 'application/x-www-form-urlencoded'
    });
  },

  /**
    @method scheduleAccessTokenRefresh
    @private
  */
  scheduleAccessTokenRefresh: function(expiresIn, expiresAt, refreshToken) {
    var _this = this;
    if (this.refreshAccessTokens) {
      Ember.run.cancel(this._refreshTokenTimeout);
      delete this._refreshTokenTimeout;
      var now = new Date();
      if (Ember.isEmpty(expiresAt) && !Ember.isEmpty(expiresIn)) {
        expiresAt = new Date(now.getTime() + (expiresIn - 5) * 1000).getTime();
      }
      if (!Ember.isEmpty(refreshToken) && !Ember.isEmpty(expiresAt) && expiresAt > now) {
        var waitTime = expiresAt - now.getTime();
        this._refreshTokenTimeout = Ember.run.later(this, this.refreshAccessToken, expiresIn, refreshToken, waitTime);
      }
    }
  },

  /**
    @method refreshAccessToken
    @private
  */
  refreshAccessToken: function(expiresIn, refreshToken) {
    var _this = this;
    var data  = { grant_type: 'refresh_token', refresh_token: refreshToken };
    this.makeRequest(data).then(function(response) {
      Ember.run(function() {
        expiresIn     = response.expires_in || expiresIn;
        refreshToken  = response.refresh_token || refreshToken;
        var expiresAt = _this.absolutizeExpirationTime(expiresIn);
        _this.scheduleAccessTokenRefresh(expiresIn, null, refreshToken);
        _this.trigger('ember-simple-auth:session-updated', Ember.$.extend(response, { expires_in: expiresIn, expires_at: expiresAt, refresh_token: refreshToken }));
      });
    }, function(xhr, status, error) {
      Ember.Logger.warn('Access token could not be refreshed - server responded with ' + error + '.');
    });
  },

  /**
    @method absolutizeExpirationTime
    @private
  */
  absolutizeExpirationTime: function(expiresIn) {
    if (!Ember.isEmpty(expiresIn)) {
      return new Date((new Date().getTime()) + (expiresIn - 5) * 1000).getTime();
    }
  }
});

})();



(function() {
'use strict';

/**
  The base for all store types. __This serves as a starting point for
  implementing custom stores and must not be used directly.__

  Stores may trigger the `'ember-simple-auth:session-updated'` event when
  any of the stored properties changes due to external actions (e.g. from
  another tab). The session listens to that event and will handle the changes
  accordingly. Whenever the event is triggered by the store, the session will
  forward all properties to its authenticator which might lead to the session
  being invalidated (see
  [Ember.SimpleAuth.Authenticators.Base#restore](#Ember-SimpleAuth-Authenticators-Base-restore)).

  @class Base
  @namespace Ember.SimpleAuth.Stores
  @extends Ember.Object
  @uses Ember.Evented
*/
Ember.SimpleAuth.Stores.Base = Ember.Object.extend(Ember.Evented, {
  /**
    Persists the `properties` in the store.

    `Ember.SimpleAuth.Stores.Base`'s implementation does nothing.

    @method persist
    @param {Object} properties The properties to persist
  */
  persist: function(properties) {
  },

  /**
    Restores all properties currently saved in the store.

    `Ember.SimpleAuth.Stores.Base`'s implementation always returns an empty
    plain Object.

    @method restore
    @return {Object} All properties currently persisted in the store.
  */
  restore: function() {
    return {};
  },

  /**
    Clears the store.

    `Ember.SimpleAuth.Stores.Base`'s implementation does nothing.

    @method clear
  */
  clear: function() {
  }
});

})();



(function() {
'use strict';

/**
  Store that saves its data in session cookies.

  __In order to keep multiple tabs/windows of your application in sync, this
  store has to periodically (every 500ms) check the cookies__ for changes as
  there are no events that notify of changes in cookies. The recommended
  alternative is
  [Ember.SimpleAuth.Stores.LocalStorage](#Ember-SimpleAuth-Stores-LocalStorage)
  that also persistently stores data but instead of cookies relies on the
  `localStorage` API and does not need to poll for external changes.

  This store will trigger the `'ember-simple-auth:session-updated'` event when
  any of its cookies is changed from another tab or window.

  @class Cookie
  @namespace Ember.SimpleAuth.Stores
  @extends Ember.SimpleAuth.Stores.Base
*/
Ember.SimpleAuth.Stores.Cookie = Ember.SimpleAuth.Stores.Base.extend({
  /**
    The prefix to use for the store's cookie names so they can be distinguished
    from other cookies.

    @property cookieNamePrefix
    @type String
    @default 'ember_simple_auth:'
  */
  cookieNamePrefix: 'ember_simple_auth:',
  /**
    @property _secureCookies
    @private
  */
  _secureCookies: window.location.protocol === 'https:',
  /**
    @property _syncPropertiesTimeout
    @private
  */
  _syncPropertiesTimeout: null,

  /**
    @method init
    @private
  */
  init: function() {
    this.syncProperties();
  },

  /**
    Persists the `properties` in session cookies.

    @method persist
    @param {Object} properties The properties to persist
  */
  persist: function(properties) {
    for (var property in properties) {
      this.write(property, properties[property], null);
    }
    this._lastProperties = JSON.stringify(this.restore());
  },

  /**
    Restores all properties currently saved in the session cookies identified
    by the `cookieNamePrefix`.

    @method restore
    @return {Object} All properties currently persisted in the session cookies
  */
  restore: function() {
    var _this      = this;
    var properties = {};
    this.knownCookies().forEach(function(cookie) {
      properties[cookie] = _this.read(cookie);
    });
    return properties;
  },

  /**
    Clears the store by deleting all session cookies prefixed with the
    `cookieNamePrefix`.

    @method clear
  */
  clear: function() {
    var _this = this;
    this.knownCookies().forEach(function(cookie) {
      _this.write(cookie, null, (new Date(0)).toGMTString());
    });
    this._lastProperties = null;
  },

  /**
    @method read
    @private
  */
  read: function(name) {
    var value = document.cookie.match(new RegExp(this.cookieNamePrefix + name + '=([^;]+)')) || [];
    return decodeURIComponent(value[1] || '');
  },

  /**
    @method write
    @private
  */
  write: function(name, value, expiration) {
    var expires = Ember.isEmpty(expiration) ? '' : '; expires=' + expiration;
    var secure  = !!this._secureCookies ? ';secure' : '';
    document.cookie = this.cookieNamePrefix + name + '=' + encodeURIComponent(value) + expires + secure;
  },

  /**
    @method knownCookies
    @private
  */
  knownCookies: function() {
    var _this = this;
    return Ember.A(document.cookie.split(/[=;\s]+/)).filter(function(element) {
      return new RegExp('^' + _this.cookieNamePrefix).test(element);
    }).map(function(cookie) {
      return cookie.replace(_this.cookieNamePrefix, '');
    });
  },

  /**
    @method syncProperties
    @private
  */
  syncProperties: function() {
    var properties        = this.restore();
    var encodedProperties = JSON.stringify(properties);
    if (encodedProperties !== this._lastProperties) {
      this._lastProperties = encodedProperties;
      this.trigger('ember-simple-auth:session-updated', properties);
    }
    if (!Ember.testing) {
      Ember.run.cancel(this._syncPropertiesTimeout);
      this._syncPropertiesTimeout = Ember.run.later(this, this.syncProperties, 500);
    }
  }
});

})();



(function() {
'use strict';

/**
  Store that saves its data in memory and thus __is not actually persistent__.

  @class Ephemeral
  @namespace Ember.SimpleAuth.Stores
  @extends Ember.SimpleAuth.Stores.Base
*/
Ember.SimpleAuth.Stores.Ephemeral = Ember.SimpleAuth.Stores.Base.extend({
  /**
    @method init
    @private
  */
  init: function() {
    this.clear();
  },

  /**
    Persists the `properties`.

    @method persist
    @param {Object} properties The properties to persist
  */
  persist: function(properties) {
    this._data = Ember.$.extend(properties, this._data);
  },

  /**
    Restores all properties currently saved.

    @method restore
    @return {Object} All properties currently persisted
  */
  restore: function() {
    return Ember.$.extend({}, this._data);
  },

  /**
    Clears the store.

    @method clear
  */
  clear: function() {
    delete this._data;
    this._data = {};
  }
});

})();



(function() {
'use strict';

/**
  Store that saves its data in the browser's `localStorage`.

  This store will trigger the `'ember-simple-auth:session-updated'` event when
  any of its keys is changed from another tab or window.

  @class LocalStorage
  @namespace Ember.SimpleAuth.Stores
  @extends Ember.SimpleAuth.Stores.Base
*/
Ember.SimpleAuth.Stores.LocalStorage = Ember.SimpleAuth.Stores.Base.extend({
  /**
    The prefix to use for the store's keys so they can be distinguished from
    other keys.

    @property keyPrefix
    @type String
    @default 'ember_simple_auth:'
  */
  keyPrefix: 'ember_simple_auth:',

  /**
    @property _triggerChangeEventTimeout
    @private
  */
  _triggerChangeEventTimeout: null,

  /**
    @method init
    @private
  */
  init: function() {
    this.bindToStorageEvents();
  },

  /**
    Persists the `properties` in the `localStorage`.

    @method persist
    @param {Object} properties The properties to persist
  */
  persist: function(properties) {
    for (var property in properties) {
      var key = this.buildStorageKey(property);
      localStorage.setItem(key, properties[property]);
    }
    this._lastProperties = JSON.stringify(this.restore());
  },

  /**
    Restores all properties currently saved in the `localStorage` identified by
    the `keyPrefix`.

    @method restore
    @return {Object} All properties currently persisted in the session cookies
  */
  restore: function() {
    var _this = this;
    var properties = {};
    this.knownKeys().forEach(function(key) {
      var originalKey = key.replace(_this.keyPrefix, '');
      properties[originalKey] = localStorage.getItem(key);
    });
    return properties;
  },

  /**
    Clears the store by deleting all `localStorage` keys prefixed with the
    `keyPrefix`.

    @method clear
  */
  clear: function() {
    this.knownKeys().forEach(function(key) {
      localStorage.removeItem(key);
    });
    this._lastProperties = null;
  },

  /**
    @method buildStorageKey
    @private
  */
  buildStorageKey: function(property) {
    return this.keyPrefix + property;
  },

  /**
    @method knownKeys
    @private
  */
  knownKeys: function(callback) {
    var keys = Ember.A([]);
    for (var i = 0, l = localStorage.length; i < l; i++) {
      var key = localStorage.key(i);
      if (key.indexOf(this.keyPrefix) === 0) {
        keys.push(key);
      }
    }
    return keys;
  },

  /**
    @method bindToStorageEvents
    @private
  */
  bindToStorageEvents: function() {
    var _this = this;
    Ember.$(window).bind('storage', function(e) {
      var properties        = _this.restore();
      var encodedProperties = JSON.stringify(properties);
      if (encodedProperties !== _this._lastProperties) {
        _this._lastProperties = encodedProperties;
        Ember.run.cancel(_this._triggerChangeEventTimeout);
        _this._triggerChangeEventTimeout = Ember.run.next(_this, function() {
          this.trigger('ember-simple-auth:session-updated', properties);
        });
      }
    });
  }
});

})();



(function() {
'use strict';

/**
  The mixin for routes that require the session to be authenticated in order to
  be accessible. Including this mixin in a route will automatically add hooks
  that enforce the session to be authenticated and redirect to
  the `authenticationRoute` specified in
  [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup) if not.

  `Ember.SimpleAuth.AuthenticatedRouteMixin` performs the redirect in the
  `beforeModel` method so that in all methods executed after that the session
  is guaranteed to be authenticated. __If `beforeModel` is overridden, ensure
  that the custom implementation calls `this._super(transition)`__ so that the
  session enforcement code is actually executed.

  @class AuthenticatedRouteMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.AuthenticatedRouteMixin = Ember.Mixin.create({
  /**
    This method implements the enforcement of the session being authenticated.
    If the session is not authenticated, the current transition will be aborted
    and a redirect will be triggered to the `authenticationRoute` specified in
    [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup). The method also saves
    the intercepted transition so that it can be retried after the session has
    been authenticated (see
    [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationSucceeded](#Ember-SimpleAuth-ApplicationRouteMixin-sessionAuthenticationSucceeded)).

    @method beforeModel
    @param {Transition} transition The transition that lead to this route
  */
  beforeModel: function(transition) {
    if (!this.get('session.isAuthenticated')) {
      transition.abort();
      this.triggerSessionAuthentication(transition);
    }
  },

  /**
    @method triggerSessionAuthentication
    @private
  */
  triggerSessionAuthentication: function(transition) {
    this.set('session.attemptedTransition', transition);
    transition.send('authenticateSession');
  }
});

})();



(function() {
'use strict';

/**
  The mixin for the controller that handles the `authenticationRoute` specified
  in [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)). It provides the
  `authenticate` action that will authenticate the session with the configured
  authenticator when invoked.

  @class AuthenticationControllerMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
*/
Ember.SimpleAuth.AuthenticationControllerMixin = Ember.Mixin.create({
  /**
    The authenticator class used to authenticate the session.

    @property authenticator
    @type Ember.SimpleAuth.Authenticators.Base
    @default null
  */
  authenticator: null,

  actions: {
    /**
      This action will authenticate the session with an instance of the
      configured `authenticator` class.

      If authentication succeeds, this method triggers the
      `sessionAuthenticationSucceeded` action (see
      [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationSucceeded](#Ember-SimpleAuth-ApplicationRouteMixin-sessionAuthenticationSucceeded)).
      If authentication fails it triggers the `sessionAuthenticationFailed`
      action (see
      [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationFailed](#Ember-SimpleAuth-ApplicationRouteMixin-sessionAuthenticationFailed)).

      @method actions.authenticate
      @param {Object} options Any options the auhtenticator needs to authenticate the session
    */
    authenticate: function(options) {
      var _this = this;
      this.get('session').authenticate(this.get('authenticator'), options).then(function() {
        _this.send('sessionAuthenticationSucceeded');
      }, function(error) {
        _this.send('sessionAuthenticationFailed', error);
      });
    }
  }
});

})();



(function() {
'use strict';

/**
  The mixin for the authentication controller that handles the
  `authenticationRoute` specified in
  [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)). It provides the
  `authenticate` action that will authenticate the session with the configured
  authenticator when invoked. __This is a specialization of
  [Ember.SimpleAuth.AuthenticationControllerMixin](#Ember-SimpleAuth-AuthenticationControllerMixin)
  for authentication mechanisms that work like a regular login with
  credentials.__

  Accompanying the controller that this mixin is mixed in the application needs
  to have a `login` template with the fields `indentification` and `password`
  as well as an actionable button or link that triggers the `authenticate`
  action, e.g.:

  ```handlebars
  <form {{action 'authenticate' on='submit'}}>
    <label for="identification">Login</label>
    {{input id='identification' placeholder='Enter Login' value=identification}}
    <label for="password">Password</label>
    {{input id='password' placeholder='Enter Password' type='password' value=password}}
    <button type="submit">Login</button>
  </form>
  ```

  @class LoginControllerMixin
  @namespace Ember.SimpleAuth
  @extends Ember.SimpleAuth.AuthenticationControllerMixin
*/
Ember.SimpleAuth.LoginControllerMixin = Ember.Mixin.create(Ember.SimpleAuth.AuthenticationControllerMixin, {
  /**
    The authenticator class used to authenticate the session.

    @property authenticator
    @type Ember.SimpleAuth.Authenticators.Base
    @default Ember.SimpleAuth.Authenticators.OAuth2
  */
  authenticator: 'ember-simple-auth:authenticators:oauth2',

  actions: {
    /**
      This action will authenticate the session with an instance of the
      configured `authenticator` class if both `identification` and `password`
      are non-empty. It passes both values to the authenticator.

      _The action also resets the `password` property so sensitive data is not
      stored anywhere for longer than necessary._

      @method actions.authenticate
    */
    authenticate: function() {
      var data = this.getProperties('identification', 'password');
      if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
        this.set('password', null);
        this._super(data);
      }
    }
  }
});

})();



(function() {
'use strict';

/**
  The mixin for the application route. This defines actions to authenticate the
  session as well as to invalidate it. These actions can be used in all
  templates like this:

  ```handlebars
  {{#if session.isAuthenticated}}
    <a {{ action 'invalidateSession' }}>Logout</a>
  {{else}}
    <a {{ action 'authenticateSession' }}>Login</a>
  {{/if}}
  ```

  While this code works it is __preferrable to use the regular `link-to` helper
  for the _'login'_ link__ as that will add the `'active'` class to the link.
  For the _'logout'_ actions of course there is no route.

  ```handlebars
  {{#if session.isAuthenticated}}
    <a {{ action 'invalidateSession' }}>Logout</a>
  {{else}}
    {{#link-to 'login'}}Login{{/link-to}}
  {{/if}}
  ```

  This mixin also defines actions that are triggered whenever the session is
  successfully authenticated or invalidated and whenever authentication or
  invalidation fails.

  @class ApplicationRouteMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.ApplicationRouteMixin = Ember.Mixin.create({
  actions: {
    /**
      This action triggers transition to the `authenticationRoute` specified in
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup). It can be used in
      templates as shown above. It is also triggered automatically by
      [Ember.SimpleAuth.AuthenticatedRouteMixin](#Ember-SimpleAuth-AuthenticatedRouteMixin)
      whenever a route that requries authentication is accessed but the session
      is not currently authenticated.

      __For an application that works without an authentication route (e.g.
      because it opens a new window to handle authentication there), this is
      the method to override, e.g.:__

      ```javascript
      App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
        actions: {
          authenticateSession: function() {
            var _this = this;
            this.get('session').authenticate(App.MyCustomAuthenticator.create(), {}).then(function() {
              _this.send('sessionAuthenticationSucceeded');
            }, function(error) {
              _this.send('sessionAuthenticationFailed', error);
            });
          }
        }
      });
      ```

      @method actions.authenticateSession
    */
    authenticateSession: function() {
      this.transitionTo(Ember.SimpleAuth.authenticationRoute);
    },

    /**
      This action is triggered whenever the session is successfully
      authenticated. It retries a transition that was previously intercepted in
      [AuthenticatedRouteMixin#beforeModel](#Ember-SimpleAuth-AuthenticatedRouteMixin-beforeModel).
      If there is no intercepted transition, this action redirects to the
      `routeAfterAuthentication` specified in
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

      @method actions.sessionAuthenticationSucceeded
    */
    sessionAuthenticationSucceeded: function() {
      var attemptedTransition = this.get('session.attemptedTransition');
      if (attemptedTransition) {
        attemptedTransition.retry();
        this.set('session.attemptedTransition', null);
      } else {
        this.transitionTo(Ember.SimpleAuth.routeAfterAuthentication);
      }
    },

    /**
      This action in triggered whenever session authentication fails. The
      arguments the action is invoked with depend on the used authenticator
      (see
      [Ember.SimpleAuth.Authenticators.Base](#Ember-SimpleAuth-Authenticators-Base)).

      It can be overridden to display error messages etc.:

      ```javascript
      App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
        actions: {
          sessionAuthenticationFailed: function(error) {
            this.controllerFor('application').set('loginErrorMessage', error.message);
          }
        }
      });
      ```

      @method actions.sessionAuthenticationFailed
      @param {any} arguments Any error argument the promise returned by the authenticator rejects with, see [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)
    */
    sessionAuthenticationFailed: function() {
    },

    /**
      This action invalidates the session (see
      [Ember.SimpleAuth.Session#invalidate](#Ember-SimpleAuth-Session-invalidate)).
      If invalidation succeeds, it transitions to `routeAfterInvalidation`
      specified in [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

      @method actions.invalidateSession
    */
    invalidateSession: function() {
      var _this = this;
      this.get('session').invalidate().then(function() {
        _this.send('sessionInvalidationSucceeded');
      }, function(error) {
        _this.send('sessionInvalidationFailed', error);
      });
    },

    /**
      This action is invoked whenever the session is successfully invalidated.
      It transitions to `routeAfterInvalidation` specified in
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

      @method actions.sessionInvalidationSucceeded
    */
    sessionInvalidationSucceeded: function() {
      this.transitionTo(Ember.SimpleAuth.routeAfterInvalidation);
    },

    /**
      This action is invoked whenever session invalidation fails.

      @method actions.sessionInvalidationFailed
    */
    sessionInvalidationFailed: function(error) {
    },

    /**
      This action is invoked when an authorization error occurs (which is
      __when a server responds with HTTP status 401__). This will invalidate
      the session and transitions to the `routeAfterInvalidation` specified in
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

      @method actions.authorizationFailed
    */
    authorizationFailed: function() {
      var _this = this;
      this.get('session').invalidate().then(function() {
        _this.transitionTo(Ember.SimpleAuth.routeAfterInvalidation);
      });
    },

    /**
      @method actions.error
      @private
    */
    error: function(reason) {
      if (reason.status === 401) {
        this.send('authorizationFailed');
      }
      return true;
    }
  }
});

})();



(function() {

})();

