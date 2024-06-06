import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "@tanstack/react-router";
import { ServicePublic } from "../../client";

interface ServiceCardProps {
  username: string;
  service: ServicePublic;
}

export default function ServiceCard({ username, service }: ServiceCardProps) {
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
              as={RouterLink}
              to="/booking/$username/services/$serviceId"
              params={{
                username: username,
                serviceId: service.id,
              }}
              fontSize="md"
              color="chakra-body-text"
            >
              Book Now!
            </Link>
          </CardFooter>
        </Stack>
      </Card>
    </>
  );
}
