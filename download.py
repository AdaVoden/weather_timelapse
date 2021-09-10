import requests

base_url = "https://cam01.sci.ucalgary.ca/images/AllSkyCamImages"
suffix = ".jpg"
num = 0
while num <= 2400:
    if ((num - 60) % 100) == 0 and num != 0:
        num -= 60
        num += 100
    file_name = str(num).zfill(4) + suffix
    url = base_url + "/" + file_name
    print(f"Downloading file {url}")
    filedata = requests.get(url)
    datatowrite = filedata.content
    with open("/home/voden/Downloads/AllSkyCamImages/" + file_name, "wb") as f:
        print(filedata)
        f.write(datatowrite)
    num += 2
