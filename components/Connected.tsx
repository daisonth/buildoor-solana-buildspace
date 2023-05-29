import {
  FC,
  MouseEventHandler,
  useCallback,
  useState,
  useMemo,
  useEffect
} from "react"
import { useRouter } from "next/router"
import { PublicKey } from "@solana/web3.js"
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import {
  Metaplex,
  CandyMachine,
  walletAdapterIdentity,
  CandyMachineV2,
} from "@metaplex-foundation/js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

const Connected: FC = () => {
  const router = useRouter()
  const walletAdapter = useWallet()
  const { connection } = useConnection()
  const [candyMachine, setCandyMachine] = useState<CandyMachineV2>()
  const [isMinting, setIsMinting] = useState(false)

  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
  }, [connection, walletAdapter])

  useEffect(() => {
    if (!metaplex) return

    metaplex
      .candyMachinesV2()
      .findByAddress({
        address: new PublicKey("693PpLC6Kh2CXVDqFowbjMs3bzitwsXAPonZMcE1dq1y"),
      })
      .then((candyMachineArg) => {
        console.log(candyMachineArg)
        setCandyMachine(candyMachineArg)
      })
      .catch((error) => {
        alert(error)
      })
  }, [metaplex])

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      if (event.defaultPrevented) return;
      if (!walletAdapter.connected || !candyMachine) return;

      try {
        setIsMinting(true);
        const nft = await metaplex.candyMachinesV2().mint({ candyMachine });

        console.log(nft);
        router.push(`/newMint?mint=${nft.nft.address.toBase58()}`);
      } catch (error) {
        alert(error + "blah");
      } finally {
        setIsMinting(false);
      }
    },
    [metaplex, walletAdapter, candyMachine, router]
  );

  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome Buildoor.
          </Heading>

          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each buildoor is randomly generated and can be staked to receive
            <Text as="b"> $BLD</Text> Use your <Text as="b"> $BLD</Text> to
            upgrade your buildoor and receive perks within the community!
          </Text>
        </VStack>
      </Container>

      <HStack spacing={10}>
        <Image src="avatar1.png" alt="" />
        <Image src="avatar2.png" alt="" />
        <Image src="avatar3.png" alt="" />
        <Image src="avatar4.png" alt="" />
        <Image src="avatar5.png" alt="" />
      </HStack>

      <Button onClick={handleClick} bgColor="accent" color="white" maxW="380px">
        <HStack>
          <Text>mint buildoor</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </VStack>
  )
}

export default Connected
