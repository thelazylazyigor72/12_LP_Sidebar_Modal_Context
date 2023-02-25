import React from "react";
import Modal from "./Modal";
import Sidebar from "./Sidebar";
import Home from "./Home";

//помним что в индексе наш апп обернут в провайдер, соответственно все дети провайдера смогут получать контекст
function App() {
	return (
		<>
			<Home />
			<Modal />
			<Sidebar />
		</>
	);
}

export default App;
