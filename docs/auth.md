## Auth
This package exports some common and useful components for setting up Auth flows. It provides templated
login and logout pages, which are parameter customize-able and support social login flows via OAuth2.
It also provides an `AuthenticatedContainer`, which can be used to wrap a component that requires
Authentication to access/view.

### Usage
To use the auth components, you need to do a few things in your project:
#### Client-Side
1. Import the `Auth` page and hook it into your routing system at the path `/auth`. Pass any OAuth2
   providers you want to use or other auth options to this component.
2. Tell your app state to extend the `AuthState` export--this will ensure that redux has the properties
   needed for the auth components to work.
3. Include the `auth` reducers under the `auth` scope in your app's reducers.
3. For cookie support: import the `getExistingAuthState` function and include it under the `auth` key
   of your `getExistingState` function.
4. Create a React component which wraps its render contents in the `AuthenticatedContainer` component. 
#### Server-Side
The client library makes a few assumptions about the way the server API is set up. This assumes
you're using Django as the backend framework with a few nifty plugins installed (all of these can be installed with `pip`):
* `djangorestframework` - provides easy REST API creation. The other plugins extend this.
* `social-auth-app-django` - provides social auth backends to enable things like FB and Google login
* `djangorestframework-jwt` - provides support for JWT tokens with Django REST Framework.
* `rest-social-auth` - provides the glue between JWT and `social-auth-app-django`.

The above libraries do require a bit of configuration:
1. http://python-social-auth-docs.readthedocs.io/en/latest/configuration/django.html - for `social-auth-app-django` configuration. Should specify `AUTHENTICATION_BVACKENDS` and keys/secrets for any social providers. Can most likely ignore documentation about setting up URL paths/views here, as the only path we require comes from `rest-social-auth`.
2. https://github.com/st4lk/django-rest-social-auth - for `rest-social-auth` configuration. Really just need to add the urls for JWT authentication. 

### How it works
When a user hits a component that's wrapped in the `AuthenticatedContainer`, the container checks
whether or not the user is logged in. If so, the user sees the page and continues as normal. If not,
the user's original destination is stored as a query parameter and the user is redirected to the login
page. Once the user completes a login flow from the login page, they are redirected to their original
destination.

There is, therefore, no need to explicitly link to the login page in your app, though you can do this
along with specifying a default redirect path after login. Instead, it's recommended that your login
links lead the user directly to the app, which should be protected by an `AuthenticatedContainer`.
