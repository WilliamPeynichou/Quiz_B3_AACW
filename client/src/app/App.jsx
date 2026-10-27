import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthProvider } from '../application/context/AuthContext'
import { LoginPage, RegisterPage } from '../presentation/pages/auth/AuthPage'
import { CatalogPage } from '../presentation/pages/catalog/CatalogPage'
import { GamePage } from '../presentation/pages/game/GamePage'
import { RankingPage } from '../presentation/pages/ranking/RankingPage'
import '../styles/App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/play" element={<GamePage />} />
        <Route path="/ranking" element={<RankingPage />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
