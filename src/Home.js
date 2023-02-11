import React from 'react'
import { FaBars } from 'react-icons/fa'
import { useGlobalContext } from './context'

//basically homepage which initially show us burger and modal btn at the center of viewport
//* but actually this component its to show us use case for context hehehe
const Home = () => {
  //вместо 2х импортов имеем один и сразу полчаем все что нужно
  //*но вот вопрос, зачем мы в контекст файле сделали 2 стейта которые смыслом в целом не связаны?
  //*это показательный пример, и на самом деле он говорит нам что
  //*допустим у нас будет 10 модальников и всем нужен такой функционал - вот тебе и юз кейс. 
  const {openSidebar,openModal} = useGlobalContext()

  return (
    <main>
      <button className='sidebar-toggle' onClick={openSidebar}>
        <FaBars />
      </button>
      <button className='btn' onClick={openModal}>
        show modal
      </button>
    </main>
  ) 
}

export default Home
