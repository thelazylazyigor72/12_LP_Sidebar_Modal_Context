import React, { useState, useContext } from 'react'

//*Это вот как и говорилось в про-типсах = выносить определение контекста и связанной с ним хуеты в отдельный файл
//определяем объект контекста
const AppContext = React.createContext()

//*внимательно! мы создаем компонент провайдер-обертку и экспортим его, чтобы не в основном коде каждый раз чет описывать
//для этого же мы передаем проп чилдрен чтобы как мы видим пихать в провайдер что угодно
const AppProvider = ({children}) => {
    //определяем стейты и закрыть/открыть функции для модальника и сайдбара и передаем их в value 
    //чтобы потом использовать их в любой точке приложения
    const [isSidebarOpen,setIsSidebarOpen] = useState(false)
    const [isModalOpen,setIsModalOpen] = useState(false)

    const openSidebar = () => {
        setIsSidebarOpen(true)
    }
    const closeSidebar = () => {
        setIsSidebarOpen(false)
    }

    const openModal = () => {
        setIsModalOpen(true)
    }
    const closeModal = () => {
        setIsModalOpen(false)
    }


    return <AppContext.Provider value={{
        isModalOpen,
        isSidebarOpen,
        openModal,
        openSidebar,
        closeModal,
        closeSidebar
    }}>
        {children}
    </AppContext.Provider>
}

//custom hook
//этот хук - это просто пример имплементации от Джона, чтобы каждый раз в нужных файлах не импортить и объект-контекста
//и хук юзКонтекст, мы сделаем лучше кастом хук здесь - который просто возвращает нам объект контекста в нужный нам файл
//удобно! и импортов не 2 а 1, почему бы и нет
//но в целом можно было обойтись и без этого, это так, хенди типсы.
//важно что мы пишем use - иначе это не считается кастомным хуком
export const useGlobalContext = () => {
    return useContext(AppContext)
}

export {AppContext, AppProvider}