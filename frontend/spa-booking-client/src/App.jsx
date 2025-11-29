import { useState } from 'react'
import './App.css'
import AppRouter from "./router/AppRouter";
import AuthProvider from "./contexts/AuthContext";

export default function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}