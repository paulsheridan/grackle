from models import User


def get_user(user_id: str) -> User:
    table = get_dynamodb_table()

    user_id_key: str = f"USER#{user_id}"
    response: dict = table.query(
        KeyConditionExpression=Key("PK").eq(user_id_key) & Key("SK").eq(user_id_key)
    )
    return User(**response["Items"][0])


def create_or_update_user(user: User) -> User:
    table = get_dynamodb_table()

    table.put_item(Item=user.to_item())
    return user
