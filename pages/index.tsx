import type { NextPage } from "next"
import Connected from "../components/Connected"
import Disconnected from "../components/Disconnected"
import MainLayout from "@/components/MainLayout"
import { useWallet } from "@solana/wallet-adapter-react"

const Home: NextPage = () => {
  const { connected } = useWallet()
  return (
    <MainLayout>
      {connected ? <Connected /> : <Disconnected />}
    </MainLayout>
  )
}
export default Home
