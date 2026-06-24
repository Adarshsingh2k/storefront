import Navbar from './components/Navbar/Navbar';
import CartDrawer from './components/CartDrawer/CartDrawer';
import AppRouter from './router/AppRouter';

export default function App() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <AppRouter />
    </>
  );
}
