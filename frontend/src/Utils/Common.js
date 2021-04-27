// Return the user display name data from the local storage
export const getUserDisplayNameFromLocalStore = () => {
    const userDisplayName = localStorage.getItem('displayName');
    return userDisplayName
  }
  export const getEmailFromLocalStore = () => {
    const email = localStorage.getItem('email');
    return email
  }  
  // Return the token from the local storage
  export const getTokenFromLocalStore = () => {
    return localStorage.getItem('token') || null;
  }
   
  // Remove the token and user from the local storage
  export const removeUserDataFromLocalStore = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('displayName');
    localStorage.removeItem('email');
  }
   
  // set the token and user from the local storage
  export const saveUserDataToLocalStore = (token, displayName, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('displayName', displayName);
    localStorage.setItem('email', email);
  }