import requests

base_url = "http://136.159.57.131/weatherimages"
suffix = ".jpg"
num = 0
while num <= 1038:
    if ((num - 60) % 100) == 0 and num != 0:
        num -= 60
        num += 100
    print(num)
    file_name = str(num).zfill(4) + suffix
    url = base_url + "/" + file_name
    print(f"Downloading file {url}")
    filedata = requests.get(url)
    datatowrite = filedata.content
    with open("/home/voden/Downloads/weatherimages/" + file_name, "wb") as f:
        print(filedata)
        f.write(datatowrite)
    num += 2