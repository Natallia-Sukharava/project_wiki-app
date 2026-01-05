export function getCurrentUser() {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
  
  export function isLoggedIn() {
    return !!localStorage.getItem("token");
  }
  
  export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  