import { useEffect, useState } from "react"
import { Social } from "../../components/social"
import { FaInstagram, FaLinkedin } from "react-icons/fa"
import logoImex from '../../assets/brancox.png'

import { db } from "../../services/firebaseConnection"
import {
  getDocs,
  collection,
  orderBy,
  query,
  doc,
  getDoc
} from "firebase/firestore"


interface LinkProps{
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

interface SocialLinksProps{
  linkedin: string;
  instagram: string;
  youtube: string;
}


export function Home(){

  const [links, setLinks] = useState<LinkProps[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLinksProps>()

  useEffect( () => {
    function loadLinks(){
      const linksRef = collection(db, "links")
      const queryRef = query(linksRef, orderBy("created", "asc"))

      getDocs(queryRef)
      .then( (snapshot) => {
        let lista = [] as LinkProps[]

        snapshot.forEach( (doc) => {
          lista.push({
            id: doc.id,
            name: doc.data().name,
            url: doc.data().url,
            bg: doc.data().bg,
            color: doc.data().color,
          })
        })

        setLinks(lista)
      })
    }
    loadLinks()
  },[])

  useEffect( () => {
    async function loadSocialLinks(){
      const docRef = doc(db, "social", "link")
      getDoc(docRef)
      .then( (snapshot) => {
        if(snapshot.data() !== undefined){
          setSocialLinks({
            linkedin: snapshot.data()?.linkedin,
            instagram: snapshot.data()?.instagram,
            youtube: snapshot.data()?.youtube,
          })
        }
      })
    }
    loadSocialLinks()
  },[])


    return (
      <div className="flex flex-col w-full py-4 items-center justify-center">

        <img style={{position: "absolute", right: 0, top: 0, opacity: 0.3, zIndex: -1}} className="h-screen" src={logoImex} alt="Logo Imex" />

        <h1 className="md:text-4xl text-3xl font-bold text-white mt-20 ">Imex <span className="bg-gradient-to-r from-custom-green-imex to-green-700 bg-clip-text text-transparent">Solutions</span></h1>
        <span className="text-gray-50 mb-5 mt-3">Acesse nossos links</span>

        <main className="flex flex-col w-11/12 max-w-xl text-center">

          {links.map( (link) => (
              <section 
              style={{backgroundColor: link.bg}}
              key={link.id}
              className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer"
              >
                <a href={link.url} target="_blank">
                  <p style={{color: link.color}} className="text-base md:text-lg">
                    {link.name}
                  </p>
                </a>
              </section>
          ))}

          {socialLinks && Object.keys(socialLinks).length > 0 && (
            <div className="flex justify-center gap-3 my-4">
              <Social url={socialLinks?.linkedin} >
                <FaLinkedin size={35} color="#FFF"/>
              </Social>
              <Social url={socialLinks?.instagram} >
                <FaInstagram size={35} color="#FFF"/>
              </Social>
            </div>
          )}
        </main>
        <footer style={{backgroundColor: "#17806C"}} className="w-full fixed bottom-0 pb-3 pt-3 flex items-center justify-center">
          <span className="text-white mr-10">Copyright &copy; 2024, Todos os direitos reservados - Imex Solutions</span>
          <span className="">-Desenvolvido por Atlas WW-</span>
        </footer>

      </div>
      )
}