const { chromium } = require('playwright');


(async () => {
    try {
        const browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
        const debugSelector = async (target) => {
            const [key, value] = Object.entries(target).flat()
            console.log({key, value})
            const selector = await page.$(value);
            if (!selector) {
                console.log(`${key} not found`);
            } else {
                console.log(`${key} found`);
            }
        }

        await page.goto('https://shopee.tw/shopee-coins');

        // 點領幣：
        const coinBtn = 'main > section:nth-child(1) > div:nth-child(1) > div > section button';
        debugSelector({coinBtn})
        await page.click(coinBtn);

        // 登入頁
        const accountInput = 'input[name="loginKey"]'
        const passwordInput = 'input[name="password"]'
        debugSelector({accountInput})
        debugSelector({passwordInput})
        await page.fill(accountInput, 'yutingchu530');
        await page.fill(passwordInput, '1qaz2wsxAA');

        // 點送出
        const submitBtn = 'form button:nth-child(4):not([disabled])'
        await page.waitForSelector(`${submitBtn}`);
        debugSelector({submitBtn})
        await page.click(submitBtn);

    } catch (error) {
        console.error('Error:', error);
    }
})();