## Auth
This package exports some common and useful components for setting up Auth flows. It provides templated
login and logout pages, which are parameter customize-able and support social login flows via OAuth2.
It also provides an `AuthenticatedContainer`, which can be used to wrap a component that requires
Authentication to access/view.

### Usage
To use the auth components, you need to do a few things in your project:
1. Import the `Auth` page and hook it into your routing system at the path `/auth`. Pass any OAuth2
   providers you want to use or other auth options to this component.
2. Tell your app state to extend the `AuthState` export--this will ensure that redux has the properties
   needed for the auth components to work.
3. Include the `auth` reducers under the `auth` scope in your app's reducers.
3. For cookie support: import the `getExistingAuthState` function and include it under the `auth` key
   of your `getExistingState` function.
4. Create a React component which wraps its render contents in the `AuthenticatedContainer` component. 

### How it works
When a user hits a component that's wrapped in the `AuthenticatedContainer`, the container checks
whether or not the user is logged in. If so, the user sees the page and continues as normal. If not,
the user's original destination is stored as a query parameter and the user is redirected to the login
page. Once the user completes a login flow from the login page, they are redirected to their original
destination.

There is, therefore, no need to explicitly link to the login page in your app, though you can do this
along with specifying a default redirect path after login. Instead, it's recommended that your login
links lead the user directly to the app, which should be protected by an `AuthenticatedContainer`.
