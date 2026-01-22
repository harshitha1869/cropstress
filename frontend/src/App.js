import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PredictForm from "./components/PredictForm";
import Features from "./components/Features";
import About from "./components/About";
import AreaSelect from "./components/AreaSelect";
import { useArea } from "./context/AreaContext";

function App() {
  const { area } = useArea();

  // IF AREA NOT SELECTED → SHOW DROPDOWN PAGE
  if (!area) {
    return <AreaSelect />;
  }
  return (
    <>
      <Navbar />
      <Hero />
      <PredictForm />
      <Features />
      <About />
    </>
  );
}

export default App;
;
