// Return the user display name data from the local storage
export const getUserDisplayNameFromLocalStore = () => {
    const userDisplayName = localStorage.getItem('displayName');
    return userDisplayName
  }
   
  // Return the token which is read from the local storage
  export const getTokenFromLocalStore = () => {
    return localStorage.getItem('token') || null;
  }
   
  // Remove the token and user from the local storage
  export const removeUserDataFromLocalStore = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('displayName');
  }
   
  // Set the token and user from the local storage
  export const saveUserDataToLocalStore = (token, displayName) => {
    localStorage.setItem('token', token);
    localStorage.setItem('displayName', displayName);
  }