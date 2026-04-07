const fs = require("fs");
const path = require("path");

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, "..", relativePath), "utf8");

describe("Contact page requirements", () => {
  const contactPageSource = read("pages/ContactPage.tsx");
  const appSource = read("App.jsx");
  const navigationSource = read("pages/Navigation.tsx");

  test("has links to other pages at the top of the page", () => {
    expect(appSource).toMatch(/<Navigation[\s\S]*\/>/);

    const topNavPages = [
      "home",
      "mission",
      "board",
      "mentors",
      "partners",
      "contact",
      "calendar",
    ];

    topNavPages.forEach((page) => {
      expect(navigationSource).toMatch(new RegExp(`onNavigate\\('${page}'\\)`));
    });
  });

  test("has a login button in the top right corner", () => {
    expect(navigationSource).toMatch(/onLoginClick/);
    expect(navigationSource).toMatch(/>\s*Login\s*</);
  });

  test("allows site visitors to fill out a standard inquiry form", () => {
    expect(contactPageSource).toMatch(/<form[\s\S]*>/);
    expect(contactPageSource).toMatch(/name="name"/);
    expect(contactPageSource).toMatch(/name="email"/);
    expect(contactPageSource).toMatch(/name="message"/);
  });

  test("requires name, email, type of inquiry dropdown, and message", () => {
    expect(contactPageSource).toMatch(
      /<input[^>]*id="name"[^>]*required[^>]*>|<input[^>]*required[^>]*id="name"[^>]*>/
    );
    expect(contactPageSource).toMatch(
      /<input[^>]*id="email"[^>]*required[^>]*>|<input[^>]*required[^>]*id="email"[^>]*>/
    );
    expect(contactPageSource).toMatch(
      /<input[^>]*id="message"[^>]*required[^>]*>|<input[^>]*required[^>]*id="message"[^>]*>/
    );
    expect(contactPageSource).toMatch(/<select[^>]*required[^>]*>/);
  });

  test("has a button to submit inquiry", () => {
    expect(contactPageSource).toMatch(/type="submit"/);
    expect(contactPageSource).toMatch(/Send Message|Submit/i);
  });
});
