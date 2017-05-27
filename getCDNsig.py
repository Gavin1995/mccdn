import urllib.parse
import collections
import hmac
import hashlib
def calculate_authorization_header(request_url, request_timestamp, key_id, key_value, http_method):
    urlparts = urllib.parse.urlparse(request_url)
    queries = urllib.parse.parse_qs(urlparts.query)
    ordered_queries = collections.OrderedDict(queries)
    message = "%s\r\n%s\r\n%s\r\n%s" % (urlparts.path, ", ".join(['%s:%s' % (key, value[0]) for (key, value) in ordered_queries.items()]), request_timestamp, http_method)
    digest = hmac.new(bytearray(key_value, "utf-8"), bytearray(message, "utf-8"), hashlib.sha256).hexdigest().upper()
    return "AzureCDN %s:%s" % (key_id, digest)    
sig=calculate_authorization_header("https://api-preview.cdn.azure.cn/subscriptions/852dbaa8-02bc-4e40-bc04-4c5f24e1a828/endpoints?apiVersion=1.0","2017-5-26 13:48:00","e1360ed0-289b-485f-a225-293398cf422d","OGMzYzE1NzYtMmU2ZS00OWNhLTljZmUtNjc5ODYzN2ZlYWJm","GET")
print(sig)
