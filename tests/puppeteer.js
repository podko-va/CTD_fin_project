const puppeteer = require("puppeteer");
require("../app");
const { seed_db, testUserPassword, factory } = require("../util/seed_db");
const Appointment = require("../models/Appointment");

let testUser = null;

let page = null;
let browser = null;

describe("Appointment puppeteer test", function () {
    before(async function () {
        this.timeout(10000);
        browser = await puppeteer.launch({ headless: false, slowMo: 100 });
        page = await browser.newPage();
        await page.goto("http://localhost:3000");
    });
    after(async function () {
        this.timeout(5000);
        await browser.close();
    });
    describe("got to site", function () {
        it("should have completed a connection", async function () {
            const { expect } = await import("chai");
            const response = await page.goto("http://localhost:3000");
            const status = response.status();
            expect(status).to.be.equal(304);

            const title = await page.title();
            expect(title).to.include("WarmEmbrace");
        });
    }); 
    describe("index page test", function () {
        this.timeout(10000);
        it('should find the "Let`s Try!" button', async () => {
            const { expect } = await import("chai");            
            // Wait for the button with ID #letsTry to appear
            const letsTryButton = await page.waitForSelector('#letsTry', { visible: true });        
            // Check if the button exists
            expect(letsTryButton).to.exist;
            // Optionally, check the button's text content
            const buttonText = await page.$eval('#letsTry', el => el.textContent);
            expect(buttonText).to.include("Let`s Try!"); // Assert the button's text
        });
        //about
        it('should find the about page', async () => {
            const { expect } = await import("chai");
            const aboutPage = await page.waitForSelector('#about');        
            // Check if the page exists
            expect(aboutPage).to.exist; 
            const displayStyle = await page.evaluate(() => {
                const element = document.querySelector('#about');
                return window.getComputedStyle(element).display;
                });
            expect(displayStyle).to.equal('block');        
        });
        it('should find the logon-register page and check visibility', async () => {
            const { expect } = await import("chai");
            const aboutPage = await page.waitForSelector('#logon-register');        
            // Check if the page exists
            expect(aboutPage).to.exist; 
            const displayStyle = await page.evaluate(() => {
                const element = document.querySelector('#logon-register');
                return window.getComputedStyle(element).display;
                });
            expect(displayStyle).to.equal('none');        
        });
    });

    describe("logon page test", function () {
        this.timeout(10000);
        it("finds the way to logon page", async () => {
            const { expect } = await import("chai");
            
            this.logonLink = await page.waitForSelector("#letsTry");
            await this.logonLink.click();
            await page.waitForNavigation();

            const buttonSelector = '#logon';
            console.log('Clicked on logon link, waiting for navigation...');
            await page.waitForSelector(buttonSelector, { timeout: 60000 });
            expect(buttonSelector).to.exist;
        });
        it("field email on the page", async () => {
            const { expect } = await import("chai");
            const buttonSelector = '#logon';
            await page.click(buttonSelector);
            console.log('Clicked on logon...');

            await page.waitForNavigation();

            const newPageSelector = '#email'; 
            const newPageElement = await page.waitForSelector(newPageSelector);
            expect(newPageElement).to.exist;       
        });
    });
  
});    
