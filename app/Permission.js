/*
authorize: User has authorized this permission
denied: User has denied this permission at least once. On iOS this means that the user will not be prompted again. Android users can be prompted multiple times until they select 'Never ask me again'
restricted: iOS - this means user is not able to grant this permission, either because it's not supported by the device or because it has been blocked by parental controls. Android - this means that the user has selected 'Never ask me again' while denying permission
undetermined: User has not yet been prompted with a permission dialog
*/
const Permission = {
  Authorized: 'authorized',
  Denied: 'denied',
  Restricted: 'restricted',
  Undetermined: 'undetermined'
}

export default Permission
