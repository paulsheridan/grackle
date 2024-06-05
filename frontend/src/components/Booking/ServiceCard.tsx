import {
  Stack,
  Card,
  Button,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Image,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { ServicePublic } from "../../client";

interface ServiceCardProps {
  username: string;
  service: ServicePublic;
}

export default function ServiceCard({ username, service }: ServiceCardProps) {
  const { onClose } = useDisclosure();
  return (
    <>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src="https://picsum.photos/400/400"
          alt="Tattoo"
        />

        <Stack>
          <CardBody>
            <Text fontSize={"md"} fontWeight="medium">
              {service.duration + " Minutes"}
            </Text>
            <Heading size="lg">{service.name}</Heading>
            <Text py="2">This is a stand-in description.</Text>
          </CardBody>

          <CardFooter>
            <Link
              to="/booking/$username/services/$service_id"
              params={{ username: username, service_id: service.id }}
              onClick={onClose}
            >
              <Button ml={2} fontSize="xl" color="chakra-body-text">
                Book It!
              </Button>
            </Link>
          </CardFooter>
        </Stack>
      </Card>
    </>
  );
}
