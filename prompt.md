Please create a browser-based, multiplayer game called "Animal Kingdom" as a single, interactive HTML artifact.

The game should be a turn-based, free-for-all battle for **2-6 players**. The last animal standing wins. Each player chooses an animal at the start, and all animals begin with 3 HP (except Gorilla, which starts with 4 HP).

### Core Game Mechanics:

On their turn, a player can choose one of the following actions:

-   **Attack:** A standard attack that deals 1 damage to a single chosen opponent.

-   **Do Nothing:** Skip the turn.

-   **Heal:** Restore 1 HP to your own animal. This is a powerful action and can only be used **once per game**.

-   **Shield:** Block all incoming damage for one full round of turns (the shield lasts until it is your turn again). This can also only be used **once per game**.

-   **Use Ability:** Use the animal's unique special ability.


### Animal Roster:

The game includes the following five animals:

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

4.  **Gorilla:**

    -   **Starting HP:** 4 HP (instead of 3).

    -   **Ability:** Rampage. A devastating one-time attack that deals 4 damage to a single opponent.

    -   **Cooldown:** None. This ability can only be used once per game.

5.  **Monkey:**

    -   **Ability:** Mischief. A one-time ability that permanently disables another player's ability for the rest of the game.

    -   **Cooldown:** None. This ability can only be used once per game.


### Visual Style and UI:

The entire visual theme, including colors and fonts, should be based on the provided logo.

_(The user would paste the logo here)_

-   **Logo Integration:** The logo should be prominently displayed during the setup screen. Once the game starts, the logo should shrink to a small fixed position in the upper left corner that doesn't affect page flow. Reference the logo file as `logo.png`.

-   **Icons:** Use Lucide Icons (https://unpkg.com/lucide@latest) for all button icons and visual elements.

-   **Styling:** CSS is extracted to an external `styles.css` file for better maintainability.

-   **Color Palette:** Use a warm, earthy color scheme derived from the logo (e.g., golden browns, soft beiges, rich earth tones).

-   **Typography:** Use a clean, elegant font with very subtle serifs that matches the text style in the logo (e.g., "Merriweather").

-   **Theme Toggle:** A button in the upper-right corner allows switching between light and dark modes. The theme preference persists via localStorage. The light mode uses warm, earthy tones (beiges, browns), while dark mode uses darker backgrounds with adjusted colors for readability.

-   **Setup Screen:**

    -   Allow players to optionally enter custom names. If no name is entered, default to "Player 1", "Player 2", etc.

    -   Preserve player name and animal selections when changing the number of players.

-   **UI Elements:**

    -   Display all animals on screen with their animal name prominently (large, bold) and player name smaller below it.

    -   Show current HP bars for each animal.

    -   Clearly indicate whose turn it is.

    -   The ability button text should dynamically change based on the current player's animal (e.g., "Use Ability: Strike" for Tiger, "Use Ability: Howl" for Coyote).

    -   Action buttons should display underlined keyboard shortcuts (e.g., "<u>A</u>ttack", "Use A<u>b</u>ility").

    -   Provide visual status indicators for active shields, sleep, ability cooldowns, and when one-time actions like Heal and Shield have been used.

    -   Include a game log with nested indentation for related actions. The log should:
        -   Show a player roster at the start
        -   Display HP after damage with format "X/Y HP"
        -   Use ASCII tree structure with corner brackets for visual nesting
        -   Nest defeated messages under HP updates
        -   Include winner announcement in the log

    -   Provide "Save Log" and "Copy to Clipboard" buttons that allow players to download the game log as a text file or copy it to clipboard at any time during the game and after the game ends.

    -   Show a clear victory screen when only one player remains, with a 2-second delay to show the final defeat.

### Keyboard Shortcuts:

-   **A** - Attack
-   **B** - Use Ability
-   **H** - Heal
-   **S** - Shield
-   **N** - Do Nothing
-   **?** - Show keyboard shortcuts help
-   **Esc** - Close keyboard shortcuts help
