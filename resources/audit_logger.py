import json
import boto3
import time
import copy
import decimal
from typing import Dict, Any
from boto3.dynamodb.conditions import Key

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('calculator_audit_logs')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    event = event.get('body', event)
    if not isinstance(event, dict):
        event = json.loads(event)
    if not event:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({
                'error': 'Invalid request body'
            })
        }
    
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET'
    }
    
    try:
        if "httpMethod" in event:
            event_type = event.get("httpMethod", "")
        else:
            event_type = event.get("requestContext", {}).get("http", {}).get("method", "")
        
        if event_type == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            limit = int(query_params.get('limit', '50'))
            start_from = query_params.get('startFrom')
            
            scan_params = {
                'Limit': limit
            }
            
            if start_from:
                scan_params['ExclusiveStartKey'] = {'timestamp': start_from}
            
            response = table.scan(**scan_params)
            
            if 'Items' in response:
                response['Items'] = sorted(response['Items'], key=lambda x: x.get('timestamp', ''))
            
            print(response)
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'items': response.get('Items', []),
                    'lastEvaluatedKey': response.get('LastEvaluatedKey'),
                    'count': response.get('Count', 0)
                }, cls=DecimalEncoder)
            }
        
        elif event_type == 'POST':
            audit_event = copy.deepcopy(event)
            
            item = {
                'eventId': audit_event['id'],
                'timestamp': audit_event['timestamp'],
                'action': audit_event['action'],
                'value': audit_event['value'],
                'ttl': int(time.time()) + (1 * 24 * 60 * 60)
            }
            
            table.put_item(Item=item)
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'message': 'Audit log stored successfully'
                }, cls=DecimalEncoder)
            }
            
    except Exception as e:
        print(f'Error: {str(e)}')
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'error': 'Operation failed',
                'details': str(e)
            })
        }