const { chromium } = require('playwright');

(async () => {
try {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.philips-da.com.tw/pages/dailycheck');
    const frameHandle = await page.$('iframe.fever-plugin');  // adjust selector as needed

    if (!frameHandle) {
        console.log('frameHandle not found');
    } else {
        console.log('frameHandle found');
    }
    const frame = await frameHandle.contentFrame();

    const checkInButtonSelector = 'div#promo-client-body > div > div > div > div > div:nth-child(4) > div button';
    await frame.click(checkInButtonSelector);

    await page.evaluate(() => {
        window.scrollTo(0, 500);
    });

    // 點登入：
    const signInBtnString = '.MuiDialogContent-root button.MuiButtonBase-root'
    const signInBtn = await frame.$(signInBtnString)
    if (!signInBtn) {
        console.log('signInBtn not found');
    } else {
        console.log('signInBtn found');
    }
    const context = await browser.newContext();
    await frame.waitForSelector('.MuiDialogContent-root button.MuiButtonBase-root');
    await frame.click(signInBtnString);


    // TODO: 等待新頁面打開 block, 抓不到新頁面
    // const [newPage] = await Promise.all([
    //     context.waitForEvent('page', { timeout: 60000 }),  // waits for the next page to be opened
    //     page.click(signInBtnString)  // or whatever action that opens a new tab/window
    // ]);
    const newPagePromise = context.waitForEvent('page', { timeout: 60000 });
    await page.click(signInBtnString);
    const newPage = await newPagePromise;

    if (!newPage) {
        console.log('newPage not found');
    } else {
        console.log('newPage found');
    }

    // 現在 'newPage' 變數代表新打開的頁面
    await newPage.waitForLoadState('load');  // 等待新頁面加載

    const newFrameHandle = await newPage.$('iframe.fever-plugin');  // adjust selector as needed
    const newFrame = await newFrameHandle.contentFrame();

    // 關掉彈出廣告
    await newFrame.waitForSelector('#omni-webpopup-close');
    await newFrame.click('#omni-webpopup-close');


    // 填寫用戶名和密碼, 送出
    await newFrame.fill('input#login', '0972819615');
    await newFrame.fill('input#password', '1qaz2wsxAA');

    await newFrame.click('button.submit');

    // 點擊簽到
    await newFrame.waitForSelector(checkInButtonSelector);
    await newFrame.click(checkInButtonSelector);

    await browser.close();
} catch (error) {
    console.error('Error:', error);
}
})();