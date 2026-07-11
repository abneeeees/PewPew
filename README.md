**PewPew** is an online community for gamers where they can write blogs, check out game info, maintain their personal games collection etc

---

## ScreenShots

<img width="1852" height="2253" alt="Screenshot 2026-07-02 at 13-55-28 pewpew" src="https://github.com/user-attachments/assets/06eec2ae-5642-476c-a691-f58f714e53bf" />

<img width="1852" height="2494" alt="Screenshot 2026-07-02 at 13-55-51 Limbo pewpew" src="https://github.com/user-attachments/assets/b263c542-fef7-4cbb-928a-c510ea81a463" />


---

## Routes

- /home
- /games
- /games/individual-games
- /community
- /collections
- /profile

---

## Running Locally 

**Getting a RAWG API Key**
1. Create an account on RAWG.
2. Generate an API key.
3. Copy `.env.example` to `.env.local`.
4. Paste your key into the `RAWG` variable.

```sh
git clone https://github.com/abneeeees/PewPew.git

cd PewPew

cp .env.example .env.local

# Edit .env.local and paste their API key

bun install
bun run dev
```

---

## File Structure

- `/app` : contains the routes
- / components : contains `UI` `Global` `GamePage` components
- / lib: Handles Data Fetching and Datasets

---

## FunFact

*The name comes from the sound that guns make in games*

---

## [License](https://github.com/abneeeees/PewPew?tab=GPL-3.0-1-ov-file)

- This projects is licensed under [**GPLv3 license**](https://github.com/abneeeees/ablist/blob/main/LICENSE).
- Users are free to run, modify, and distribute software while ensuring that all modified versions remain free and open.V

