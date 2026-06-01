import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ShopProvider } from './context/ShopContext';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { CustomCursor } from './components/common/CustomCursor';
import { Home } from './pages/Home';
import { Detail } from './pages/Detail';
import { Cart } from './pages/Cart';
import { VendorAdmin } from './pages/VendorAdmin';
import { SuperAdmin } from './pages/SuperAdmin';
import { Quiz } from './pages/Quiz';
import { Brand } from './pages/Brand';
import { Support } from './pages/Support';
import { Success } from './pages/Success';
import { Fail } from './pages/Fail';
import { Login } from './pages/Login';
import { MyPage } from './pages/MyPage';
import { SocialPopup } from './pages/SocialPopup';
import { Perfumes } from './pages/Perfumes';

function App() {
  return (
    <ShopProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <CustomCursor />
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/detail" element={<Detail />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/vendor" element={<VendorAdmin />} />
                <Route path="/admin" element={<VendorAdmin />} />
                <Route path="/superadmin" element={<SuperAdmin />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/brand" element={<Brand />} />
                <Route path="/support" element={<Support />} />
                <Route path="/success" element={<Success />} />
                <Route path="/fail" element={<Fail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/social-popup" element={<SocialPopup />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/perfumes" element={<Perfumes />} />
              </Routes>
            </main>
            <Footer />
            <Toast />
          </div>
        </Router>
      </ThemeProvider>
    </ShopProvider>
  );
}

export default App;
