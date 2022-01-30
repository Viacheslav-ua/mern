import React, { useCallback, useContext, useEffect, useState } from "react"
import { useHttp } from "../hooks/http.hook"
import {AuthContext} from "../context/AuthContext"
import { Loader } from "../components/Loader"
import { LinkList } from "../components/LinkList"

export const LinksPage = () => {
  const [links, setLinks] = useState([])
  const {loading, request} = useHttp()
  const {token} = useContext(AuthContext)

const fetchLink = useCallback(async () => {
  try {
    const fetched = await request('/api/link', 'GET', null, {
      Authorization: `Bearer ${token}`
    })
    setLinks(fetched)
    
  } catch (error) {}
}, [token, request])

useEffect(() => {
  fetchLink()
}, [fetchLink])

if (loading) {
  return <Loader />
}

  return (
    <>
     {!loading && <LinkList links={links}/>}
    </>
  )
}