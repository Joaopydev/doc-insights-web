import { BrowserRouter, Navigate, Outlet, Route, Routes} from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import AppLayout from "./components/layouts/AppLayout.tsx"
import UploadDocument from "./components/upload/UploadDocument.tsx"
import ChatScreen from "./components/chat/ChatScreen.tsx"
import SignIn from "./components/signin/SignIn.tsx"
import SignUp from "./components/signup/SignUp.tsx"
import { SplashScreen } from "./components/ui/SplashScreen.tsx"
import { useAuth } from "./contexts/auth/useAuth.ts"
import { AuthProviderContext } from "./contexts/auth/AuthProvider.tsx"
import { WebSocketProvider } from "./contexts/webscoket/WebSocketProvider.tsx"


const queryClient = new QueryClient()

function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderContext>
        <BrowserRouter>
          <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<AppLayout />}>
                  <Route path="/" element={<UploadDocument />} />
                  <Route path="/chat/:chatId" element={<ChatScreen />} />
                </Route>
              </Route>

            <Route element={<PublicRoute />}>
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<SignUp />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProviderContext>
    </QueryClientProvider>
  )
}

function PrivateRoute() {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) {
    return <SplashScreen />
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return (
    <WebSocketProvider>
      <Outlet />
    </WebSocketProvider>
  )
}

function PublicRoute() {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) {
    return <SplashScreen />
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default App
