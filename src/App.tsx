/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./app/layout";
import Page from "./app/page";
import About from "./pages/About";
import Legal from "./pages/Legal";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RootLayout>
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/about" element={<About />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}


