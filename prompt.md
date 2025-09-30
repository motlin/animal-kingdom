Please create a browser-based, multiplayer game called "Animal Kingdom" as a single, interactive HTML artifact.

The game should be a turn-based, free-for-all battle for **2-6 players**. The last animal standing wins. Each player chooses an animal at the start, and all animals begin with 3 HP.

### Core Game Mechanics:

On their turn, a player can choose one of the following actions:

-   **Attack:** A standard attack that deals 1 damage to a single chosen opponent.

-   **Do Nothing:** Skip the turn.

-   **Heal:** Restore 1 HP to your own animal. This is a powerful action and can only be used **once per game**.

-   **Shield:** Block all incoming damage for one full round of turns (the shield lasts until it is your turn again). This can also only be used **once per game**.

-   **Use Ability:** Use the animal's unique special ability.


### Animal Roster:

For the initial version, please implement the following three animals:

1.  **Coyote:**

    -   **Ability:** Howl. Puts all other animals (except other Coyotes) to sleep for one turn, causing them to skip their next action. All Coyotes are immune to Howl.

    -   **Cooldown:** This ability can be used once every two turns.

2.  **Llama:**

    -   **Ability:** Spitball. An attack with random damage, chosen as the turn's action.

    -   **Damage Probability:** 45% chance for 0 damage, 40% chance for 1 damage, and a 15% chance for 2 damage.

    -   **Cooldown:** None.

3.  **Tiger:**

    -   **Ability:** Strike. An attack that hits two different, player-chosen opponents for 1 damage each.

    -   **Cooldown:** None.


### Visual Style and UI:

The entire visual theme, including colors and fonts, should be based on the provided logo.

_(The user would paste the logo here)_

-   **Logo Integration:** The logo should be prominently displayed during the setup screen. Once the game starts, the logo should shrink to a small fixed position in the upper left corner that doesn't affect page flow. Reference the logo file as `animal-kingdom.png`.

-   **Color Palette:** Use a warm, earthy color scheme derived from the logo (e.g., golden browns, soft beiges, rich earth tones).

-   **Typography:** Use a clean, elegant font with very subtle serifs that matches the text style in the logo (e.g., "Merriweather").

-   **UI Elements:**

    -   Display all animals on screen with their animal name prominently (large, bold) and player name smaller below it.

    -   Show current HP bars for each animal.

    -   Clearly indicate whose turn it is.

    -   The ability button text should dynamically change based on the current player's animal (e.g., "Use Ability: Strike" for Tiger, "Use Ability: Howl" for Coyote).

    -   Provide visual status indicators for active shields, sleep, ability cooldowns, and when one-time actions like Heal and Shield have been used.

    -   Include a game log that clearly reports all actions taken (e.g., "Player 1's Tiger used Strike on Player 2's Llama and Player 3's Coyote.").

    -   Provide a "Save Log" button that allows players to download the game log as a text file at any time during the game and after the game ends.

    -   Show a clear victory screen when only one player remains.
