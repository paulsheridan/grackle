from models import Client


def create_or_update_client(client: Client) -> Client:
    table = get_dynamodb_table()

    table.put_item(Item=client.to_item())
    return client


def get_client(user_id: str, email: str) -> Client:
    table = get_dynamodb_table()

    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").eq(f"CLIENT#{email}")
    )
    return Client(**response["Items"][0])


def list_clients(user_id: str) -> list[Client]:
    table = get_dynamodb_table()

    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
        & Key("SK").begins_with("CLIENT#"),
    )
    return [Client(**item) for item in response["Items"]]
