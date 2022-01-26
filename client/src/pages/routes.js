import React from "react"
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthPage } from "./AuthPage"
import { CreatePage } from "./CreatePage"
import { DetailPage } from "./DetailPage"
import { LinksPage } from "./LinksPage"

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
        <>
        <Routes>
          {/* <Route path="/" element={<Layout />}> */}
            <Route path="/link" element={<LinksPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="*" element={<Navigate replace to="/create"/>} />
          {/* </Route> */}
        </Routes>
      </>
    )
  }
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="*" element={<Navigate replace to="/"/>} />
    </Routes> 
  )
}