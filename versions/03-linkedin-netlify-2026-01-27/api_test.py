from apify_client import ApifyClient
import json

# Initialize the ApifyClient with your API token
client = ApifyClient("YOUR_APIFY_TOKEN")

# Prepare the Actor input
run_input = {
    "cookie": [
    {
        "domain": ".linkedin.com",
        "expirationDate": 1772154028.478354,
        "hostOnly": False,
        "httpOnly": False,
        "name": "lms_ads",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "AQFqpJug0ZkFJAAAAZwCHbmxN6xfF2RUbZhbkydXmHuX-lh8Ub4bNAFveAxMmm9TG8yW9IpGVUHzAT5N86PM5xIde2Dlh1KI"
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1777338028.352159,
        "hostOnly": False,
        "httpOnly": False,
        "name": "_guid",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "129ae7f6-79a8-45fd-a31d-0486f2decc26"
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1801098379.313855,
        "hostOnly": False,
        "httpOnly": False,
        "name": "bcookie",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "\"v=2&e54d18a5-c177-497e-8ab9-6c60bf330702\""
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1769563822.390802,
        "hostOnly": False,
        "httpOnly": True,
        "name": "__cf_bm",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "J2wpp1tfi4eJsFV9eNst8SeB1G7xU2uMzkYsF1e9590-1769562022-1.0.1.1-FzKCjEemtemvzdA_nOCI9wWGeIXUtcSWQ22vEPvR08rBsjz76zQBdVBcjFJKtfcJzdRq5XcCcLfS5zYQXBU8SeCaOAVoZedUzn5.INqxAt4"
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1772154028.478401,
        "hostOnly": False,
        "httpOnly": False,
        "name": "lms_analytics",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "AQFqpJug0ZkFJAAAAZwCHbmxN6xfF2RUbZhbkydXmHuX-lh8Ub4bNAFveAxMmm9TG8yW9IpGVUHzAT5N86PM5xIde2Dlh1KI"
    },
    {
        "domain": ".linkedin.com",
        "hostOnly": False,
        "httpOnly": True,
        "name": "fptctx2",
        "path": "/",
        "sameSite": "None",
        "secure": True,
        "session": True,
        "storeId": "None",
        "value": "taBcrIH61PuCVH7eNCyH0LNKRXFdWqLJ6b8ywJyet7XNgB9xLQMZyfMfp3XIlWdVSs%252bQmCAIiJ6%252b6dKjBGMoVGZd1s6Lhd9ytyB5MQRDhVhfKnkrwTvRBrtk1svrnMuIzWKSSfgLGzi8O%252ffHMmCP%252f4cm8PMKXgvdYyQ9fyb4EqwozNSC1YDVn%252fa6c7%252bu8tBILxi6EgifB%252flV0J35OHqo6OttIn510e2QxM3PgFdm9od94w9kNW0TTzqBmE%252b06Sp1%252bt9BCWWgWXcdYHJs4N4M%252fDAeaHJr8UGQ65MrT3VvgGqOFKlCztAuVt%252bnmjm4ZZrqKqpF%252bzkxy3%252bxns6QEx399u4IoRnMYbNXkE4Ov8VWCIk%253d"
    },
    {
        "domain": ".www.linkedin.com",
        "expirationDate": 1801098025.521535,
        "hostOnly": False,
        "httpOnly": True,
        "name": "li_at",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "YOUR_LINKEDIN_LI_AT_COOKIE"
    },
    {
        "domain": ".linkedin.com",
        "hostOnly": False,
        "httpOnly": False,
        "name": "lang",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": True,
        "storeId": "None",
        "value": "v=2&lang=en-us"
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1769647549.706651,
        "hostOnly": False,
        "httpOnly": False,
        "name": "lidc",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "\"b=OGST02:s=O:r=O:a=O:p=O:g=3724:u=1:x=1:i=1769562379:t=1769647549:v=2:sig=AQG0RRDY5TqhoUjOQT_-IuY4Q37uRTjd\""
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1772154028.365223,
        "hostOnly": False,
        "httpOnly": False,
        "name": "AnalyticsSyncHistory",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "AQL0teUTgCnLXwAAAZwCHbkaHoUVILq9AjU9oxG1qCx-Lej3bZDn2VYIwvcjw2gzZgDAiBY4A4z_-6ZfSk8bDA"
    },
    {
        "domain": ".www.linkedin.com",
        "expirationDate": 1801098378.158563,
        "hostOnly": False,
        "httpOnly": True,
        "name": "bscookie",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "\"v=1&2026012801002105821962-8aa8-4867-8cc3-c2db0d4482dbAQGydB9VRRntWEP6EFWY9JA5yTx8duMh\""
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1801098029.711202,
        "hostOnly": False,
        "httpOnly": True,
        "name": "dfpfpt",
        "path": "/",
        "sameSite": "None",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "93e76e02b4a04298bc18c8a9933bd660"
    },
    {
        "domain": ".www.linkedin.com",
        "expirationDate": 1777338025.521631,
        "hostOnly": False,
        "httpOnly": False,
        "name": "JSESSIONID",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "\"ajax:7160386635290813687\""
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1777338379.313784,
        "hostOnly": False,
        "httpOnly": False,
        "name": "li_sugr",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "cfbc4abf-f93d-4968-9024-c38b5c2e32d6"
    },
    {
        "domain": ".www.linkedin.com",
        "expirationDate": 1785110778,
        "hostOnly": False,
        "httpOnly": False,
        "name": "li_theme",
        "path": "/",
        "sameSite": "None",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "light"
    },
    {
        "domain": ".www.linkedin.com",
        "expirationDate": 1785110778,
        "hostOnly": False,
        "httpOnly": False,
        "name": "li_theme_set",
        "path": "/",
        "sameSite": "None",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "app"
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1777338025.521589,
        "hostOnly": False,
        "httpOnly": False,
        "name": "liap",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "True"
    },
    {
        "domain": ".www.linkedin.com",
        "expirationDate": 1770771978,
        "hostOnly": False,
        "httpOnly": False,
        "name": "timezone",
        "path": "/",
        "sameSite": "None",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "America/Chicago"
    },
    {
        "domain": ".linkedin.com",
        "expirationDate": 1772154377.717623,
        "hostOnly": False,
        "httpOnly": True,
        "name": "UserMatchHistory",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": True,
        "session": False,
        "storeId": "None",
        "value": "AQJOcD-evOyZ-AAAAZwCIw3eZmFkpVw1v6cS5e1U-DoudbFfX0SHZ9mT4iQJfTypPs-UrHK2NqLETRBinhyZmCQW7YOS4itqU-uw7RwCSPo4rrBnl7KloDHOQU7SqprzvFtPbsjk7uYUiSkQnP6wcQwbbXBQSNFHkheeNQKBDJ9znwhMAm8rm5DZQN_AUCD2bmv-82K7jc_y4fd2HcEqrReBwzHAzEAY2eL45u8MBVA13fhmW6kxvam94EQXObAeNdj0H4VnRZlVUwwED_boOweRZ6xAAHtGP39namqm801FhNjiBWgcnVjppQowtc9qazd3pkf-VWrQ5Qduio8VhDoFLbZNIyi8pLVmInaYLHs54QoUdw"
    }
],
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
    "urls": [
        "https://www.linkedin.com/search/results/content/?keywords=prior%20authorizations&origin=GLOBAL_SEARCH_HEADER&contentType=%5B%22jobs%22%5D"
    ],
    "limitPerSource": 5,
    "deepScrape": True,
    "rawData": False,
    "minDelay": 2,
    "maxDelay": 8,
    "proxy": {
        "useApifyProxy": True,
        "apifyProxyCountry": "US",
    },
}

# Run the Actor and wait for it to finish
run = client.actor("kfiWbq3boy3dWKbiL").call(run_input=run_input)

# Fetch and print Actor results from the run's dataset (if there are any)
results = []
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item)
    results.append(item)

# Save results to a pretty-printed JSON file
with open('output.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)