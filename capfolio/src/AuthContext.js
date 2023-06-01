import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/auth/user")
            .then((res) => res.json())
            .then((data) => {
                if (data.Email) {
                    setUser({
                        name: `${data.FirstName} ${data.LastName}`,
                        email: data.Email,
                        userType: `${data.UserType}`,
                        photo: data.Photo
                    });
                }
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
