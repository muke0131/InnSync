import { createContext, useContext, useEffect, useState } from "react";

const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getCookie('token'));
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const authToken = `Bearer ${token}`;

  const storeToken = (server_token) => {
    setToken(server_token);
    setCookie('token', server_token, 7); 
  };

  let isLoggedIn = !!token;
  
  const logout = () => {
    setToken("");
    deleteCookie("token");
  };

  const userAuth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/user/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: authToken
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      }
      setIsLoading(false);
    } catch (err) {
        console.log(err)
      console.error("Error fetching user data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    userAuth();
  }, [token]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, storeToken, logout, user, authToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const AuthContextValue = useContext(AuthContext);
  if (!AuthContextValue) {
    throw new Error("useAuth used outside of AuthProvider");
  }
  return AuthContextValue;
};
