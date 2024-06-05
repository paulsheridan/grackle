import {
  Stack,
  Card,
  Button,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";
import { ServicePublic } from "../../client";

interface ServiceCardProps {
  service: ServicePublic;
}

export default function ServiceCard({ service }: ServiceCardProps) {
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
          alt="Caffe Latte"
        />

        <Stack>
          <CardBody>
            <Text fontSize={"md"} fontWeight="medium">
              {service.duration + " Minutes"}
            </Text>
            <Heading size="xl">{service.name}</Heading>
            <Text py="2">
              This is example text. This is probably some sort of tattoo thing,
              I bet you'll be really glad if you actually scheduled it.
              Hopefully Paul will replace this with the real descriptions
              someday.
            </Text>
          </CardBody>

          <CardFooter>
            <Button variant="solid" colorScheme="blue">
              Book it!
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    </>
  );
}
