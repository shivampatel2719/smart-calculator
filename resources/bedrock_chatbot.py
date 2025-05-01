import json
import boto3


class SmartCalculatorChatbot:
    dynamodb = boto3.resource("dynamodb")
    bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")
    table_name = "calculator_audit_logs"
    model_id = "us.anthropic.claude-3-5-haiku-20241022-v1:0"

    @staticmethod
    def get_recent_logs(limit=10):
        table = SmartCalculatorChatbot.dynamodb.Table(SmartCalculatorChatbot.table_name)
        response = table.scan()
        items = response.get("Items", [])

        items_sorted = sorted(items, key=lambda x: x.get("timestamp", ""), reverse=True)
        return items_sorted[:limit]

    @staticmethod
    def format_logs(logs):
        return "\n".join(
            f"{log['timestamp']} - {log['action']} - {log['value']}"
            for log in logs
        )

    @staticmethod
    def call_bedrock_with_logs(query, logs_text):
        system_prompt = "You are a smart calculator assistant. Answer based on the logs provided."
        user_input = f"""
User's query: "{query}"

Recent calculator audit logs:
{logs_text}

Respond using only the context from logs if possible, otherwise explain why not.
"""

        body = json.dumps({
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_input}],
            "max_tokens": 1000,
            "temperature": 0.5,
            "anthropic_version": "bedrock-2023-05-31"
        })

        response = SmartCalculatorChatbot.bedrock.invoke_model(
            modelId=SmartCalculatorChatbot.model_id,
            contentType="application/json",
            accept="application/json",
            body=body
        )

        result = json.loads(response["body"].read())
        messages = result.get("content", [])

        if messages and isinstance(messages, list) and messages[0].get("text"):
            return messages[0]["text"]

        return "I couldn't generate a meaningful response from the logs."

    @staticmethod
    def generate_response(query):
        logs = SmartCalculatorChatbot.get_recent_logs()
        logs_text = SmartCalculatorChatbot.format_logs(logs)
        return SmartCalculatorChatbot.call_bedrock_with_logs(query, logs_text)


def handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        query = body.get("query", "")
        if not query:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing query"})
            }

        reply = SmartCalculatorChatbot.generate_response(query)

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"response": reply})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

if __name__ == "__main__":
    print(handler({
        "body": json.dumps({"query": "What were the last 5 calculations?"})
    }, {}))
